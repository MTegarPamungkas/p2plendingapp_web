// pages/register.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Shield,
  FileText,
} from "lucide-react";

// Interfaces
interface SupportingDocument {
  file: File;
  type: string;
}

interface FormData {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  idNumber: string;
  bankAccount: string;
  bankName: string;
  businessName: string;
  businessType: string;
  businessDuration: string;
  password: string;
  confirmPassword: string;
  supportingDocuments: SupportingDocument[];
}

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  // State
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [role, setRole] = useState<"borrower" | "lender">("borrower");
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData | "ktp" | "swafoto" | "izin_usaha", string>>
  >({});
  const [docInputs, setDocInputs] = useState<
    { type: string; file: File | null }[]
  >([
    { type: "ktp", file: null },
    { type: "swafoto", file: null },
    { type: "izin_usaha", file: null },
  ]);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    idNumber: "",
    bankAccount: "",
    bankName: "",
    businessName: "",
    businessType: "",
    businessDuration: "",
    password: "",
    confirmPassword: "",
    supportingDocuments: [],
  });

  // Validation logic for each step
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<
      Record<keyof FormData | "ktp" | "swafoto" | "izin_usaha", string>
    > = {};

    if (currentStep === 1) {
      if (!formData.username) newErrors.username = "Username wajib diisi";
      if (!formData.fullName) newErrors.fullName = "Nama lengkap wajib diisi";
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email valid wajib diisi";
      if (!formData.phoneNumber)
        newErrors.phoneNumber = "Nomor telepon wajib diisi";
      if (!formData.address) newErrors.address = "Alamat wajib diisi";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Tanggal lahir wajib diisi";
      if (!formData.idNumber || !/^\d{16}$/.test(formData.idNumber))
        newErrors.idNumber = "Nomor KTP harus 16 digit";
      if (!docInputs[0].file) newErrors.ktp = "Dokumen KTP wajib diunggah";
      if (!docInputs[1].file)
        newErrors.swafoto = "Swafoto dengan KTP wajib diunggah";
    }

    if (currentStep === 2) {
      if (!formData.bankAccount)
        newErrors.bankAccount = "Nomor rekening wajib diisi";
      if (!formData.bankName) newErrors.bankName = "Nama bank wajib diisi";
    }

    if (currentStep === 3 && role === "borrower") {
      if (!formData.businessName)
        newErrors.businessName = "Nama usaha wajib diisi";
      if (!formData.businessType)
        newErrors.businessType = "Jenis usaha wajib diisi";
      if (
        !formData.businessDuration ||
        isNaN(Number(formData.businessDuration)) ||
        Number(formData.businessDuration) <= 0
      )
        newErrors.businessDuration = "Lama operasi usaha harus valid";
      if (!docInputs[2].file)
        newErrors.izin_usaha = "Izin usaha wajib diunggah";
    }

    if (currentStep === 4) {
      if (!formData.password) newErrors.password = "Kata sandi wajib diisi";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Kata sandi tidak cocok";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      console.log(`Validation errors in step ${currentStep}:`, newErrors);
    } else {
      console.log(`Step ${currentStep} validated successfully`);
    }
    return Object.keys(newErrors).length === 0;
  };

  // Input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id !== "supportingDocuments") {
      console.log(`Input changed: ${id} = ${value}`);
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSelectChange = (id: keyof FormData, value: string) => {
    console.log(`Select changed: ${id} = ${value}`);
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        console.log(`File too large: ${file.name}, size: ${file.size}`);
        alert("Ukuran file terlalu besar. Maksimal 5MB.");
        return;
      }
      if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
        console.log(`Invalid file type: ${file.type}`);
        alert("File harus berupa JPG, PNG, atau PDF.");
        return;
      }
      console.log(
        `File selected: ${file.name}, type: ${docInputs[index].type}`
      );
      setDocInputs((prev) =>
        prev.map((input, i) => (i === index ? { ...input, file } : input))
      );
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    console.log(`File removed: ${docInputs[index].type}`);
    setDocInputs((prev) =>
      prev.map((input, i) => (i === index ? { ...input, file: null } : input))
    );
  };

  // Navigation handlers
  const handleNext = () => {
    console.log(
      `Attempting to move to next step from step ${step}, role: ${role}`
    );
    if (validateStep(step)) {
      const nextStep = step === 2 && role === "lender" ? 4 : step + 1;
      setStep(nextStep);
      console.log(`Moved to step ${nextStep}`);
    } else {
      console.log(`Failed to move to next step due to validation errors`);
    }
  };

  const handlePrevious = () => {
    console.log(`Moving to previous step from step ${step}`);
    const prevStep = step === 4 && role === "lender" ? 2 : step - 1;
    setStep(prevStep);
    console.log(`Moved to step ${prevStep}`);
  };

  // Form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(`Form submission initiated for role: ${role}`);
    if (!validateStep(4)) {
      console.log(`Submission blocked due to validation errors`);
      return;
    }

    setIsSubmitting(true);

    const validDocs = docInputs
      .filter((input) => input.file && input.type)
      .map((input) => ({
        file: input.file!,
        type: input.type,
      }));

    const requiredDocsCount = role === "borrower" ? 3 : 2;
    if (validDocs.length < requiredDocsCount) {
      console.log(
        `Submission failed: Insufficient documents. Required: ${requiredDocsCount}, Provided: ${validDocs.length}`
      );
      alert("Harap unggah semua dokumen yang diperlukan.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "supportingDocuments" && value) {
          formDataToSend.append(key, value);
        }
      });
      formDataToSend.append("role", role);
      validDocs.forEach((doc) => {
        formDataToSend.append(`supportingDocuments`, doc.file);
        formDataToSend.append(`supportingDocumentsType`, doc.type);
      });

      console.log(`Submitting form data with ${validDocs.length} documents`);
      const result = await register(formDataToSend);
      if (result.success) {
        console.log(`Registration successful for user: ${formData.username}`);
        setFormData((prev) => ({ ...prev, supportingDocuments: validDocs }));
        setStep(5);
      } else {
        throw new Error(result.error || "Registrasi gagal");
      }
    } catch (error: any) {
      console.error("Error submitting registration:", error);
      alert(
        `Terjadi kesalahan saat mendaftar: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
      console.log(`Submission process completed`);
    }
  };

  // Thumbnail generation for uploaded files
  const getThumbnail = (file: File | null): string | null => {
    if (file && file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  // Cleanup for object URLs
  useEffect(() => {
    console.log(`Cleaning up object URLs`);
    return () => {
      docInputs.forEach((input) => {
        if (input.file && input.file.type.startsWith("image/")) {
          URL.revokeObjectURL(URL.createObjectURL(input.file));
        }
      });
    };
  }, [docInputs]);

  // Render step indicator
  const renderStepIndicator = () => {
    const steps = [
      "Info Pribadi",
      "Info Bank",
      role === "borrower" ? "Info Usaha" : "",
      "Keamanan",
    ].filter(Boolean);
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step >= index + 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 ${
                    step > index + 1 ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-sm">
          {steps.map((stepName, index) => (
            <div
              key={index}
              className={
                step >= index + 1 ? "text-foreground" : "text-muted-foreground"
              }
            >
              {stepName}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render form content
  const renderFormContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="space-y-2">
              <Label>Saya ingin mendaftar sebagai</Label>
              <RadioGroup
                value={role}
                onValueChange={(value: "borrower" | "lender") => {
                  console.log(`Role changed to: ${value}`);
                  setRole(value);
                }}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="borrower"
                    id="borrower"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="borrower"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    UMKM
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="lender"
                    id="lender"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="lender"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Pemberi Pinjaman
                  </Label>
                </div>
              </RadioGroup>
            </div>
            {[
              {
                id: "username",
                label: "Username",
                type: "text",
                hint: "Masukkan username unik untuk akun Anda",
              },
              {
                id: "fullName",
                label: "Nama Lengkap",
                type: "text",
                hint: "Masukkan nama lengkap sesuai KTP",
              },
              {
                id: "email",
                label: "Email",
                type: "email",
                hint: "Masukkan alamat email aktif",
              },
              {
                id: "phoneNumber",
                label: "Nomor Telepon",
                type: "tel",
                hint: "Masukkan nomor telepon aktif",
              },
              {
                id: "address",
                label: "Alamat",
                type: "text",
                hint: "Masukkan alamat lengkap Anda",
              },
              {
                id: "dateOfBirth",
                label: "Tanggal Lahir",
                type: "date",
                hint: "Masukkan tanggal lahir sesuai KTP",
              },
              {
                id: "idNumber",
                label: "Nomor KTP",
                type: "text",
                hint: "Masukkan 16 digit nomor KTP",
              },
            ].map(({ id, label, type, hint }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  type={type}
                  value={
                    formData[id as keyof Omit<FormData, "supportingDocuments">]
                  }
                  onChange={handleInputChange}
                  required
                  className={
                    errors[id as keyof FormData] ? "border-red-500" : ""
                  }
                />
                <p className="text-xs text-muted-foreground">{hint}</p>
                {errors[id as keyof FormData] && (
                  <p className="text-xs text-red-500">
                    {errors[id as keyof FormData]}
                  </p>
                )}
              </div>
            ))}
            {[
              {
                id: "ktp",
                label: "Dokumen KTP",
                index: 0,
                accept: "image/*",
                hint: "Pilih file gambar KTP Anda",
              },
              {
                id: "swafoto",
                label: "Swafoto dengan KTP",
                index: 1,
                accept: "image/*",
                hint: "Pilih file gambar swafoto dengan KTP",
              },
            ].map(({ id, label, index, accept, hint }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id}>{label}</Label>
                <div
                  className={`rounded-lg border border-dashed p-4 ${
                    errors[id as "ktp" | "swafoto"]
                      ? "border-red-500"
                      : "border-border"
                  }`}
                >
                  {!docInputs[index].file ? (
                    <div className="flex flex-col items-center justify-center space-y-2 text-center">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Upload className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="text-sm font-medium">Unggah {label}</h4>
                      <p className="text-xs text-muted-foreground">{hint}</p>
                      <Input
                        id={id}
                        type="file"
                        accept={accept}
                        className="hidden"
                        onChange={(e) => handleFileChange(index, e)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(id)?.click()}
                      >
                        Pilih File
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        File: {docInputs[index].file?.name}
                      </p>
                      <div className="flex items-center justify-center gap-4">
                        {getThumbnail(docInputs[index].file) ? (
                          <img
                            src={getThumbnail(docInputs[index].file)!}
                            alt={`Thumbnail ${label}`}
                            className="h-20 w-20 object-cover rounded-md"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted">
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
                {errors[id as "ktp" | "swafoto"] && (
                  <p className="text-xs text-red-500">
                    {errors[id as "ktp" | "swafoto"]}
                  </p>
                )}
              </div>
            ))}
          </>
        );
      case 2:
        return (
          <>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium">Informasi Bank</h3>
                <p className="text-sm text-muted-foreground">
                  {role === "borrower"
                    ? "Informasi rekening untuk pencairan dana pinjaman"
                    : "Informasi rekening untuk transfer dana pinjaman"}
                </p>
              </div>
              {[
                {
                  id: "bankAccount",
                  label: "Nomor Rekening",
                  type: "text",
                  hint: "Masukkan nomor rekening bank Anda",
                },
                {
                  id: "bankName",
                  label: "Nama Bank",
                  type: "text",
                  hint: "Masukkan nama bank (misalnya, BCA, Mandiri, BRI)",
                },
              ].map(({ id, label, type, hint }) => (
                <div key={id} className="space-y-2">
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    type={type}
                    value={
                      formData[
                        id as keyof Omit<FormData, "supportingDocuments">
                      ]
                    }
                    onChange={handleInputChange}
                    required
                    className={
                      errors[id as keyof FormData] ? "border-red-500" : ""
                    }
                  />
                  <p className="text-xs text-muted-foreground">{hint}</p>
                  {errors[id as keyof FormData] && (
                    <p className="text-xs text-red-500">
                      {errors[id as keyof FormData]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        );
      case 3:
        return role === "borrower" ? (
          <>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium">Informasi Usaha</h3>
                <p className="text-sm text-muted-foreground">
                  Informasi tentang usaha yang akan didanai
                </p>
              </div>
              {[
                {
                  id: "businessName",
                  label: "Nama Usaha",
                  type: "text",
                  hint: "Masukkan nama usaha Anda",
                },
                {
                  id: "businessDuration",
                  label: "Lama Operasi (Tahun)",
                  type: "number",
                  hint: "Masukkan lama usaha telah beroperasi",
                  min: "0",
                },
              ].map(({ id, label, type, hint, min }) => (
                <div key={id} className="space-y-2">
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    type={type}
                    value={
                      formData[
                        id as keyof Omit<FormData, "supportingDocuments">
                      ]
                    }
                    onChange={handleInputChange}
                    required
                    min={min}
                    className={
                      errors[id as keyof FormData] ? "border-red-500" : ""
                    }
                  />
                  <p className="text-xs text-muted-foreground">{hint}</p>
                  {errors[id as keyof FormData] && (
                    <p className="text-xs text-red-500">
                      {errors[id as keyof FormData]}
                    </p>
                  )}
                </div>
              ))}
              <div className="space-y-2">
                <Label htmlFor="businessType">Jenis Usaha</Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) =>
                    handleSelectChange("businessType", value)
                  }
                >
                  <SelectTrigger
                    id="businessType"
                    className={errors.businessType ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Pilih jenis usaha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trade">Perdagangan</SelectItem>
                    <SelectItem value="service">Jasa</SelectItem>
                    <SelectItem value="production">Produksi</SelectItem>
                    <SelectItem value="other">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Pilih jenis usaha yang sesuai
                </p>
                {errors.businessType && (
                  <p className="text-xs text-red-500">{errors.businessType}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="izin_usaha">Izin Usaha (NIB/SIUP)</Label>
                <div
                  className={`rounded-lg border border-dashed p-4 ${
                    errors.izin_usaha ? "border-red-500" : "border-border"
                  }`}
                >
                  {!docInputs[2].file ? (
                    <div className="flex flex-col items-center justify-center space-y-2 text-center">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Upload className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="text-sm font-medium">Unggah Izin Usaha</h4>
                      <p className="text-xs text-muted-foreground">
                        Pilih file PDF/JPG/PNG izin usaha
                      </p>
                      <Input
                        id="izin_usaha"
                        type="file"
                        accept=".pdf,.jpg,.png"
                        className="hidden"
                        onChange={(e) => handleFileChange(2, e)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("izin_usaha")?.click()
                        }
                      >
                        Pilih File
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        File: {docInputs[2].file.name}
                      </p>
                      <div className="flex items-center justify-center gap-4">
                        {getThumbnail(docInputs[2].file) ? (
                          <img
                            src={getThumbnail(docInputs[2].file)!}
                            alt="Thumbnail Izin Usaha"
                            className="h-20 w-20 object-cover rounded-md"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted">
                            <FileText className="h-10 w-10 text-muted-foreground" />
                          </div>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFile(2)}
                        >
                          Hapus File
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                {errors.izin_usaha && (
                  <p className="text-xs text-red-500">{errors.izin_usaha}</p>
                )}
              </div>
            </div>
          </>
        ) : null;
      case 4:
        return (
          <>
            {[
              {
                id: "password",
                label: "Kata Sandi",
                type: "password",
                hint: "Masukkan kata sandi yang aman",
              },
              {
                id: "confirmPassword",
                label: "Konfirmasi Kata Sandi",
                type: "password",
                hint: "Masukkan kata sandi yang sama",
              },
            ].map(({ id, label, type, hint }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  type={type}
                  value={
                    formData[id as keyof Omit<FormData, "supportingDocuments">]
                  }
                  onChange={handleInputChange}
                  required
                  className={
                    errors[id as keyof FormData] ? "border-red-500" : ""
                  }
                />
                <p className="text-xs text-muted-foreground">{hint}</p>
                {errors[id as keyof FormData] && (
                  <p className="text-xs text-red-500">
                    {errors[id as keyof FormData]}
                  </p>
                )}
              </div>
            ))}
            <div className="rounded-md bg-muted/30 p-4">
              <div className="flex items-start gap-4">
                <Shield className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h4 className="text-sm font-medium">Keamanan Akun</h4>
                  <p className="text-xs text-muted-foreground">
                    Kata sandi Anda dienkripsi untuk keamanan maksimal.
                  </p>
                </div>
              </div>
            </div>
          </>
        );
      case 5:
        return (
          <>
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">
                  Pendaftaran Berhasil!
                </CardTitle>
                <CardDescription className="mt-2">
                  Akun Anda telah berhasil dibuat dan sedang menunggu
                  verifikasi.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md bg-muted/30 p-4">
                <h3 className="mb-2 font-medium">
                  Apa yang terjadi selanjutnya?
                </h3>
                <ol className="ml-4 list-decimal space-y-2 text-sm text-muted-foreground">
                  <li>Dokumen Anda akan diverifikasi dalam 24 jam.</li>
                  <li>Data Anda dienkripsi dan disimpan di blockchain.</li>

                  <li>
                    Setelah disetujui, Anda dapat mulai menggunakan platform.
                  </li>
                </ol>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link href="/login">Masuk ke Akun</Link>
              </Button>
            </CardFooter>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Buat Akun</h1>
          <p className="text-muted-foreground">
            Lengkapi formulir untuk bergabung dengan platform P2P lending kami
          </p>
        </div>
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Daftar</CardTitle>
              <CardDescription>
                Bergabung dengan platform P2P lending berbasis blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {step !== 5 && renderStepIndicator()}
              {renderFormContent()}
            </CardContent>
            {step !== 5 && (
              <CardFooter className="flex justify-between">
                {step > 1 && (
                  <Button variant="outline" onClick={handlePrevious}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Sebelumnya
                  </Button>
                )}
                {step < (role === "borrower" ? 4 : 3) ? (
                  <Button
                    onClick={handleNext}
                    className={step === 1 ? "ml-auto" : ""}
                  >
                    Langkah Berikutnya <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Mendaftar..." : "Daftar"}
                  </Button>
                )}
              </CardFooter>
            )}
          </form>
        </Card>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" /> Secured by Hyperledger Fabric
          blockchain technology
        </div>
      </div>
    </div>
  );
}
