"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Shield,
  FileText,
} from "lucide-react";
import { BorrowerDashboardLayout } from "@/components/borrower-dashboard-layout";
import { useAPI, useMutation } from "@/hooks/useAPI";
import { loanAPI } from "@/api/apiServices";

// Define the type for supporting documents
interface SupportingDocument {
  file: File;
  type: string; // User-defined document type
}

// Define the type for formData to match the loanPayload structure
interface FormData {
  amount: string;
  interestRate: string;
  term: string;
  purpose: string;
  scoreFactors: {
    loanAmount: string;
    monthlyCashFlow: string;
    incomeSources: string[];
  };
  supportingDocuments: SupportingDocument[];
}

// Fungsi untuk menghitung cicilan bulanan
const calculateMonthlyPayment = (
  amount: number,
  interestRate: number,
  term: number
) => {
  const monthlyRate = interestRate / 100 / 12; // Suku bunga bulanan
  const n = term; // Jangka waktu dalam bulan
  if (monthlyRate === 0) {
    return amount / n; // Jika suku bunga 0, cicilan = jumlah pinjaman / periode
  }
  const monthlyPayment =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, n)) /
    (Math.pow(1 + monthlyRate, n) - 1);
  return monthlyPayment;
};

export default function BorrowerApplyPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    interestRate: "",
    term: "",
    purpose: "",
    scoreFactors: {
      loanAmount: "",
      monthlyCashFlow: "",
      incomeSources: [],
    },
    supportingDocuments: [],
  });
  const [numDocuments, setNumDocuments] = useState<number>(1); // Number of documents to upload
  const [docInputs, setDocInputs] = useState<
    { type: string; file: File | null }[]
  >([{ type: "", file: null }]); // Track type and file for each document

  const { mutateAsync: createLoanMutation, loading: createLoanLoading } =
    useMutation<{ message: string }>();
  const {
    mutateAsync: submitDocumentMutation,
    loading: submitDocumentLoading,
  } = useMutation<{
    success: boolean;
    message: string;
    data: {
      id: string;
      name: string;
      type: string;
      filePath: string;
      blockchainDocumentId: string;
      userId: string;
      uploadedAt: string;
    };
    timestamp: string;
  }>();

  // Debug: Log formData and docInputs when step changes
  useEffect(() => {
    console.log(
      "Current step:",
      step,
      "formData:",
      formData,
      "docInputs:",
      docInputs
    );
  }, [step, formData, docInputs]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      formData.supportingDocuments.forEach((doc) => {
        if (doc.file.type.startsWith("image/")) {
          URL.revokeObjectURL(URL.createObjectURL(doc.file));
        }
      });
    };
  }, [formData.supportingDocuments]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      ...(id === "loanAmount" || id === "monthlyCashFlow"
        ? { scoreFactors: { ...prev.scoreFactors, [id]: value } }
        : { [id]: value }),
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleIncomeSourceChange = (
    source: string,
    checked: string | boolean
  ) => {
    const isChecked = checked === true;
    setFormData((prev) => ({
      ...prev,
      scoreFactors: {
        ...prev.scoreFactors,
        incomeSources: isChecked
          ? [...prev.scoreFactors.incomeSources, source]
          : prev.scoreFactors.incomeSources.filter((s) => s !== source),
      },
    }));
  };

  // Handle changes to the number of documents
  const handleNumDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value) || 1); // Ensure at least 1
    setNumDocuments(value);
    setDocInputs((prev) => {
      const newInputs = Array(value)
        .fill(null)
        .map((_, i) => prev[i] || { type: "", file: null });
      return newInputs;
    });
  };

  // Handle document type input change
  const handleDocTypeInputChange = (index: number, value: string) => {
    setDocInputs((prev) =>
      prev.map((input, i) => (i === index ? { ...input, type: value } : input))
    );
  };

  // Handle file input change
  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocInputs((prev) =>
        prev.map((input, i) => (i === index ? { ...input, file } : input))
      );
      e.target.value = ""; // Clear input after upload
    }
  };

  // Remove a file
  const removeFile = (index: number) => {
    setDocInputs((prev) =>
      prev.map((input, i) => (i === index ? { ...input, file: null } : input))
    );
  };

  // Fungsi handleSubmit yang diperbarui
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Filter valid documents (both type and file are provided)
    const validDocs = docInputs
      .filter((input) => input.type.trim() && input.file)
      .map((input) => ({
        file: input.file!,
        type: input.type.trim(),
      }));

    if (validDocs.length === 0) {
      alert("Harap unggah setidaknya satu dokumen dengan jenis yang valid.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload documents in parallel and collect document IDs
      const documentPromises = validDocs.map((doc) =>
        submitDocumentMutation(() => loanAPI.submitDocument(doc.type, doc.file))
      );
      const documentResponses = await Promise.all(documentPromises);
      const documentIds = documentResponses.map((res) => {
        console.log("ashajsha", res);
        if (!res?.success) {
          throw new Error(`Failed to upload document: ${res!.message}`);
        }
        console.log(
          `Document ${res!.data.blockchainDocumentId} uploaded:`,
          res!.message
        );
        return res!.data.blockchainDocumentId;
      });

      // Submit loan application with document IDs
      const loanData = {
        amount: Number(formData.amount),
        interestRate: Number(formData.interestRate) / 100,
        term: Number(formData.term),
        purpose: formData.purpose,
        scoreFactors: {
          loanAmount: Number(formData.amount),
          monthlyCashFlow: Number(formData.scoreFactors.monthlyCashFlow),
          incomeSources: formData.scoreFactors.incomeSources,
        },
        supportingDocuments: documentIds,
      };

      const loanResponse = await createLoanMutation(() =>
        loanAPI.createLoan(loanData)
      );
      console.log("Loan creation response:", loanResponse);

      setFormData((prev) => ({
        ...prev,
        supportingDocuments: validDocs,
      }));

      setStep(5); // Success step
    } catch (error) {
      console.error("Error submitting loan or documents:", error);
      alert("Terjadi kesalahan saat mengirim aplikasi atau dokumen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Function to get thumbnail URL or fallback icon
  const getThumbnail = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null; // Use fallback icon for non-image files
  };

  // Function to get purpose label
  const getPurposeLabel = (value: string) => {
    const purposes: { [key: string]: string } = {
      "working-capital": "Modal Kerja",
      equipment: "Pembelian Peralatan",
      expansion: "Ekspansi Bisnis",
      inventory: "Pembiayaan Inventaris",
      refinancing: "Refinancing Utang",
      other: "Lainnya",
    };
    return purposes[value] || value;
  };

  return (
    <BorrowerDashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Ajukan Pinjaman
            </h1>
            <p className="text-muted-foreground">
              Lengkapi formulir aplikasi untuk meminta pendanaan bagi bisnis
              Anda
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step >= 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <div
                className={`h-1 flex-1 ${
                  step >= 2 ? "bg-primary" : "bg-muted"
                }`}
              ></div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step >= 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <div
                className={`h-1 flex-1 ${
                  step >= 3 ? "bg-primary" : "bg-muted"
                }`}
              ></div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step >= 3
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                3
              </div>
              <div
                className={`h-1 flex-1 ${
                  step >= 4 ? "bg-primary" : "bg-muted"
                }`}
              ></div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step >= 4
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                4
              </div>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <div
                className={
                  step >= 1 ? "text-foreground" : "text-muted-foreground"
                }
              >
                Detail Pinjaman
              </div>
              <div
                className={
                  step >= 2 ? "text-foreground" : "text-muted-foreground"
                }
              >
                Informasi Bisnis
              </div>
              <div
                className={
                  step >= 3 ? "text-foreground" : "text-muted-foreground"
                }
              >
                Dokumen
              </div>
              <div
                className={
                  step >= 4 ? "text-foreground" : "text-muted-foreground"
                }
              >
                Ringkasan
              </div>
            </div>
          </div>

          <Card>
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle>Detail Pinjaman</CardTitle>
                  <CardDescription>
                    Berikan informasi tentang pinjaman yang Anda ajukan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Jumlah Pinjaman</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="25000"
                      value={formData.amount}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Masukkan jumlah yang ingin Anda pinjam
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Suku Bunga (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      placeholder="5.5"
                      value={formData.interestRate}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Masukkan suku bunga yang diinginkan (misalnya, 5.5%)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="term">Jangka Waktu Pinjaman</Label>
                    <Select
                      value={formData.term}
                      onValueChange={(value) =>
                        handleSelectChange("term", value)
                      }
                    >
                      <SelectTrigger id="term">
                        <SelectValue placeholder="Pilih jangka waktu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 bulan</SelectItem>
                        <SelectItem value="2">2 bulan</SelectItem>
                        <SelectItem value="3">3 bulan</SelectItem>
                        <SelectItem value="6">6 bulan</SelectItem>
                        <SelectItem value="12">12 bulan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Tujuan Pinjaman</Label>
                    <Select
                      value={formData.purpose}
                      onValueChange={(value) =>
                        handleSelectChange("purpose", value)
                      }
                    >
                      <SelectTrigger id="purpose">
                        <SelectValue placeholder="Pilih tujuan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="working-capital">
                          Modal Kerja
                        </SelectItem>
                        <SelectItem value="equipment">
                          Pembelian Peralatan
                        </SelectItem>
                        <SelectItem value="expansion">
                          Ekspansi Bisnis
                        </SelectItem>
                        <SelectItem value="inventory">
                          Pembiayaan Inventaris
                        </SelectItem>
                        <SelectItem value="refinancing">
                          Refinancing Utang
                        </SelectItem>
                        <SelectItem value="other">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={nextStep}>
                    Langkah Berikutnya <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            )}

            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle>Informasi Bisnis</CardTitle>
                  <CardDescription>
                    Berikan informasi lebih lanjut tentang bisnis Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyCashFlow">Arus Kas Bulanan</Label>
                    <Input
                      id="monthlyCashFlow"
                      type="number"
                      placeholder="15000"
                      value={formData.scoreFactors.monthlyCashFlow}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Masukkan arus kas bulanan bisnis Anda
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Sumber Pendapatan</Label>
                    <div className="grid gap-2">
                      {["salary", "business", "investments", "other"].map(
                        (source) => (
                          <div
                            key={source}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={source}
                              checked={formData.scoreFactors.incomeSources.includes(
                                source
                              )}
                              onCheckedChange={(checked) =>
                                handleIncomeSourceChange(source, checked)
                              }
                            />
                            <Label htmlFor={source}>
                              {source.charAt(0).toUpperCase() + source.slice(1)}
                            </Label>
                          </div>
                        )
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Pilih semua sumber pendapatan yang berlaku
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Sebelumnya
                  </Button>
                  <Button onClick={nextStep}>
                    Langkah Berikutnya <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            )}

            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle>Unggah Dokumen</CardTitle>
                  <CardDescription>
                    Tentukan jumlah dokumen yang ingin diunggah dan masukkan
                    jenis dokumen secara manual
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="numDocuments">Jumlah Dokumen</Label>
                    <Input
                      id="numDocuments"
                      type="number"
                      min="1"
                      value={numDocuments}
                      onChange={handleNumDocumentsChange}
                      placeholder="1"
                    />
                    <p className="text-xs text-muted-foreground">
                      Masukkan jumlah dokumen yang akan diunggah (min: 1)
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label>Dokumen</Label>
                    <div className="grid gap-4">
                      {docInputs.map((input, index) => (
                        <div key={index} className="space-y-2">
                          <div className="space-y-2">
                            <Label htmlFor={`doc-type-${index}`}>
                              Jenis Dokumen {index + 1}
                            </Label>
                            <Input
                              id={`doc-type-${index}`}
                              type="text"
                              placeholder="Masukkan jenis dokumen (misalnya, Laporan Keuangan)"
                              value={input.type}
                              onChange={(e) =>
                                handleDocTypeInputChange(index, e.target.value)
                              }
                            />
                          </div>
                          <div className="rounded-lg border border-dashed border-border p-4">
                            <div className="flex flex-col items-center justify-center space-y-2 text-center">
                              {!input.file && (
                                <>
                                  <div className="rounded-full bg-primary/10 p-2">
                                    <Upload className="h-5 w-5 text-primary" />
                                  </div>
                                  <h4 className="text-sm font-medium">
                                    Unggah Dokumen {index + 1}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    Pilih satu file untuk dokumen ini
                                  </p>
                                  <Input
                                    id={`file-upload-${index}`}
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(index, e)}
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      document
                                        .getElementById(`file-upload-${index}`)
                                        ?.click()
                                    }
                                  >
                                    Pilih File
                                  </Button>
                                </>
                              )}
                              {input.file && (
                                <div className="mt-2 space-y-2">
                                  <p className="text-xs text-muted-foreground">
                                    File yang dipilih: {input.file.name}
                                  </p>
                                  <div className="flex items-center justify-center gap-4">
                                    {getThumbnail(input.file) ? (
                                      <img
                                        src={getThumbnail(input.file)!}
                                        alt={`Thumbnail dokumen ${index + 1}`}
                                        className="h-20 w-20 object-cover rounded-md"
                                      />
                                    ) : (
                                      <div className="flex items-center justify-center h-20 w-20 bg-muted rounded-md">
                                        <FileText className="h-10 w-10 text-muted-foreground" />
                                      </div>
                                    )}
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => removeFile(index)}
                                    >
                                      Hapus File
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Masukkan jenis dokumen dan unggah file yang sesuai
                    </p>
                  </div>

                  <div className="rounded-md bg-muted/30 p-4">
                    <div className="flex items-start gap-4">
                      <Shield className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <h4 className="text-sm font-medium">
                          Penanganan Dokumen Aman
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Semua dokumen dienkripsi dan disimpan dengan aman di
                          platform blockchain kami.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Sebelumnya
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={
                      docInputs.some(
                        (input) => input.type.trim() && !input.file
                      ) ||
                      docInputs.filter(
                        (input) => input.type.trim() && input.file
                      ).length === 0
                    }
                  >
                    Lihat Ringkasan <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            )}

            {step === 4 && (
              <>
                <CardHeader>
                  <CardTitle>Ringkasan Aplikasi Pinjaman</CardTitle>
                  <CardDescription>
                    Tinjau detail pinjaman, informasi bisnis, dan dokumen yang
                    Anda ajukan sebelum mengirim
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Detail Pinjaman */}
                  <div className="rounded-md bg-muted/30 p-4">
                    <h3 className="mb-2 font-medium">Detail Pinjaman</h3>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Jumlah Pinjaman:
                        </span>
                        <span className="font-medium">
                          Rp {Number(formData.amount).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Suku Bunga:
                        </span>
                        <span className="font-medium">
                          {formData.interestRate}% per tahun
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Jangka Waktu:
                        </span>
                        <span className="font-medium">
                          {formData.term} bulan
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Cicilan Per Bulan:
                        </span>
                        <span className="font-medium">
                          Rp{" "}
                          {calculateMonthlyPayment(
                            Number(formData.amount),
                            Number(formData.interestRate),
                            Number(formData.term)
                          ).toLocaleString("id-ID", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Pembayaran:
                        </span>
                        <span className="font-medium">
                          Rp{" "}
                          {(
                            calculateMonthlyPayment(
                              Number(formData.amount),
                              Number(formData.interestRate),
                              Number(formData.term)
                            ) * Number(formData.term)
                          ).toLocaleString("id-ID", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Tujuan Pinjaman:
                        </span>
                        <span className="font-medium">
                          {getPurposeLabel(formData.purpose)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Informasi Bisnis */}
                  <div className="rounded-md bg-muted/30 p-4">
                    <h3 className="mb-2 font-medium">Informasi Bisnis</h3>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Arus Kas Bulanan:
                        </span>
                        <span className="font-medium">
                          Rp{" "}
                          {Number(
                            formData.scoreFactors.monthlyCashFlow
                          ).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Sumber Pendapatan:
                        </span>
                        <span className="font-medium">
                          {formData.scoreFactors.incomeSources.length > 0
                            ? formData.scoreFactors.incomeSources
                                .map(
                                  (source) =>
                                    source.charAt(0).toUpperCase() +
                                    source.slice(1)
                                )
                                .join(", ")
                            : "Tidak ada"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dokumen */}
                  <div className="rounded-md bg-muted/30 p-4">
                    <h3 className="mb-2 font-medium">Dokumen yang Diunggah</h3>
                    <div className="grid gap-2 text-sm">
                      {docInputs
                        .filter((input) => input.type.trim() && input.file)
                        .map((input, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-muted-foreground">
                              {input.type}:
                            </span>
                            <span className="font-medium">
                              {input.file?.name}
                            </span>
                          </div>
                        ))}
                      {docInputs.filter(
                        (input) => input.type.trim() && input.file
                      ).length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          Tidak ada dokumen yang diunggah
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Sebelumnya
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting || createLoanLoading || submitDocumentLoading
                    }
                  >
                    {isSubmitting || createLoanLoading || submitDocumentLoading
                      ? "Mengirim..."
                      : "Konfirmasi dan Kirim"}
                  </Button>
                </CardFooter>
              </>
            )}

            {step === 5 && (
              <>
                <CardHeader>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 rounded-full bg-primary/10 p-3">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">
                      Aplikasi Terkirim!
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Aplikasi pinjaman Anda telah berhasil dikirim untuk
                      ditinjau
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Detail Pinjaman */}
                  <div className="rounded-md bg-muted/30 p-4">
                    <h3 className="mb-2 font-medium">Detail Pinjaman Anda</h3>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Jumlah Pinjaman:
                        </span>
                        <span className="font-medium">
                          Rp {Number(formData.amount).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Suku Bunga:
                        </span>
                        <span className="font-medium">
                          {formData.interestRate}% per tahun
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Jangka Waktu:
                        </span>
                        <span className="font-medium">
                          {formData.term} bulan
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Cicilan Per Bulan:
                        </span>
                        <span className="font-medium">
                          Rp{" "}
                          {calculateMonthlyPayment(
                            Number(formData.amount),
                            Number(formData.interestRate),
                            Number(formData.term)
                          ).toLocaleString("id-ID", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Pembayaran:
                        </span>
                        <span className="font-medium">
                          Rp{" "}
                          {(
                            calculateMonthlyPayment(
                              Number(formData.amount),
                              Number(formData.interestRate),
                              Number(formData.term)
                            ) * Number(formData.term)
                          ).toLocaleString("id-ID", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Informasi Selanjutnya */}
                  <div className="rounded-md bg-muted/30 p-4">
                    <h3 className="mb-2 font-medium">
                      Apa yang terjadi selanjutnya?
                    </h3>
                    <ol className="ml-4 list-decimal space-y-2 text-sm text-muted-foreground">
                      <li>
                        Sistem kami akan menganalisis aplikasi Anda dan
                        menghasilkan skor kredit yang diverifikasi blockchain.
                      </li>
                      <li>
                        Aplikasi Anda akan ditinjau oleh tim kami dalam waktu 24
                        jam.
                      </li>
                      <li>
                        Setelah disetujui, pinjaman Anda akan dicantumkan di
                        pasar kami untuk didanai oleh pemberi pinjaman.
                      </li>
                      <li>
                        Anda akan menerima pemberitahuan saat pemberi pinjaman
                        mendanai pinjaman Anda.
                      </li>
                      <li>
                        Setelah didanai sepenuhnya, uang akan dicairkan ke akun
                        Anda.
                      </li>
                    </ol>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button asChild>
                    <a href="/borrower/loans">Lihat Status</a>
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </div>
    </BorrowerDashboardLayout>
  );
}
