/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Image as ImageIcon, Link as LinkIcon, MessageSquare, Save, ChevronRight, Plus, Trash2, Sparkles } from "lucide-react";
import { upsertExtraData, updateExtraLink, updateExtraHeading, updateWebsiteLogo } from "@/services/extra-data";
import { SuccessToast, ErrorToast } from "@/lib/utils";

interface ExtraData {
  adImage1?: string;
  adImage2?: string;
  adImage3?: string;
  adImage4?: string;
  adImage5?: string;
  adImage6?: string;
  adImage7?: string;
  link1?: string;
  link2?: string;
  heading?: string[];
  websiteLogo?: string;
}

interface ContentManagerProps {
  initialData: ExtraData;
}

export function ContentManager({ initialData }: ContentManagerProps) {
  const [data, setData] = useState<ExtraData>(initialData);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(1);
  const [updatingLink, setUpdatingLink] = useState<string | null>(null);
  const [updatingHeading, setUpdatingHeading] = useState(false);
  const [updatingLogo, setUpdatingLogo] = useState(false);
  const [headings, setHeadings] = useState<string[]>(initialData.heading || []);
  const [activeHeadingIndex, setActiveHeadingIndex] = useState(0);

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCarouselIndex((prev) => (prev % 5) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-slide headings preview
  useEffect(() => {
    if (headings.length === 0) return;
    const interval = setInterval(() => {
      setActiveHeadingIndex((prev) => (prev + 1) % headings.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [headings.length]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeKey) return;

    setUploadingKey(activeKey);
    const formData = new FormData();
    formData.append("adImage", file);
    formData.append("data", JSON.stringify({ imageKey: activeKey }));

    try {
      const res = await upsertExtraData(formData);
      if (res.success) {
        SuccessToast(`${activeKey} updated successfully!`);
        setData(res.data);
      } else {
        ErrorToast(res.message || "Failed to update image");
      }
    } catch {
      ErrorToast("Something went wrong");
    } finally {
      setUploadingKey(null);
      setActiveKey(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLinkUpdate = async (key: string, value: string) => {
    setUpdatingLink(key);
    try {
      const res = await updateExtraLink(key, value);
      if (res.success) {
        SuccessToast(`${key} updated successfully!`);
        setData((prev) => ({ ...prev, [key]: value }));
      } else {
        ErrorToast(res.message || "Failed to update link");
      }
    } catch {
      ErrorToast("Something went wrong");
    } finally {
      setUpdatingLink(null);
    }
  };

  const handleHeadingUpdate = async () => {
    // Filter out empty strings before saving
    const filteredHeadings = headings.filter(h => h.trim() !== "");
    if (filteredHeadings.length === 0) {
      ErrorToast("Please add at least one notice");
      return;
    }

    setUpdatingHeading(true);
    try {
      const res = await updateExtraHeading(filteredHeadings);
      if (res.success) {
        SuccessToast("Notices updated successfully!");
        setData((prev) => ({ ...prev, heading: filteredHeadings }));
        setHeadings(filteredHeadings);
      } else {
        ErrorToast(res.message || "Failed to update notices");
      }
    } catch {
      ErrorToast("Something went wrong");
    } finally {
      setUpdatingHeading(false);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUpdatingLogo(true);
    const formData = new FormData();
    formData.append("logo", file);
    formData.append("data", JSON.stringify({}));

    try {
      const res = await updateWebsiteLogo(formData);
      if (res.success) {
        SuccessToast("Website logo updated successfully!");
        setData((prev) => ({ ...prev, websiteLogo: res.data?.websiteLogo }));
      } else {
        ErrorToast(res.message || "Failed to update website logo");
      }
    } catch {
      ErrorToast("Something went wrong");
    } finally {
      setUpdatingLogo(false);
      e.target.value = "";
    }
  };

  const addHeading = () => {
    setHeadings([...headings, ""]);
  };

  const removeHeading = (index: number) => {
    const newHeadings = headings.filter((_, i) => i !== index);
    setHeadings(newHeadings);
    if (activeHeadingIndex >= newHeadings.length) {
      setActiveHeadingIndex(0);
    }
  };

  const triggerUpload = (key: string) => {
    setActiveKey(key);
    fileInputRef.current?.click();
  };

  const ImageCard = ({ id, label, currentImage }: { id: string; label: string; currentImage?: string }) => (
    <Card className="group relative min-w-0 overflow-hidden p-0">
      <CardHeader className="min-w-0 border-b bg-muted/50 p-3">
        <CardTitle className="flex min-w-0 items-center gap-2 text-sm font-medium">
          <ImageIcon className="h-4 w-4 text-primary" />
          <span className="min-w-0 truncate">{label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 p-0">
        <div className="relative flex aspect-video w-full min-w-0 items-center justify-center overflow-hidden bg-muted">
          {currentImage ? (
            <Image
              src={currentImage}
              alt={label}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex min-w-0 flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-8 w-8 opacity-20" />
              <span className="text-xs">No image uploaded</span>
            </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="secondary"
              size="sm"
              className="h-8"
              onClick={() => triggerUpload(id)}
              disabled={uploadingKey === id}
            >
              {uploadingKey === id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Update
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Website Logo */}
      <section className="min-w-0 space-y-4 overflow-hidden">
        <div className="flex flex-col gap-2 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
            <ImageIcon className="h-5 w-5 text-primary" />
            Website Logo
          </h2>
          <p className="text-sm italic text-muted-foreground">Recommended: transparent PNG</p>
        </div>

        <Card className="min-w-0 max-w-full overflow-hidden p-4">
          <div className="grid min-w-0 max-w-full grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="flex min-w-0 max-w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="relative flex h-20 w-20 max-w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                {data.websiteLogo ? (
                  <Image
                    src={data.websiteLogo}
                    alt="Website logo"
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">Current website logo</p>
                <p className="wrap-break-word text-sm text-muted-foreground">
                  This logo will appear on the website navbar.
                </p>
              </div>
            </div>

            <Input
              id="website-logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
              disabled={updatingLogo}
            />
            <Button
              type="button"
              disabled={updatingLogo}
              className="w-full justify-center sm:w-auto"
              onClick={() => document.getElementById("website-logo-upload")?.click()}
            >
              {updatingLogo ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Update Logo
            </Button>
          </div>
        </Card>
      </section>

      {/* Top Navbar Notices Editor */}
      <section className="min-w-0 space-y-4 overflow-hidden">
        <div className="flex flex-col gap-3 border-b pb-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-start">
            <h2 className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
              <MessageSquare className="h-5 w-5 text-primary" />
              Top Navbar Notices (Scrolling)
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addHeading}
              className="h-8 w-full gap-1.5 sm:w-fit"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Notice
            </Button>
          </div>
          <Button 
            onClick={handleHeadingUpdate} 
            disabled={updatingHeading}
            size="sm"
            className="w-full gap-2 lg:w-fit"
          >
            {updatingHeading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save All Notices
          </Button>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
          <Card className="min-w-0 overflow-hidden p-4">
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {headings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto opacity-20 mb-2" />
                  <p className="text-sm">No notices added yet.</p>
                  <Button variant="link" onClick={addHeading}>Click here to add one</Button>
                </div>
              ) : (
                headings.map((heading, idx) => (
                  <div key={idx} className="group flex min-w-0 animate-in items-end gap-2 fade-in slide-in-from-left-2 duration-300">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Notice {idx + 1}
                      </Label>
                      <Input 
                        placeholder={`Enter notice message ${idx + 1}...`}
                        value={heading}
                        onChange={(e) => {
                          const newHeadings = [...headings];
                          newHeadings[idx] = e.target.value;
                          setHeadings(newHeadings);
                        }}
                        className="h-9 min-w-0 focus-visible:ring-primary"
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
                      onClick={() => removeHeading(idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Notice Preview */}
          <div className="flex min-w-0 flex-col justify-center space-y-4">
            <div className="relative flex h-12 min-w-0 items-center justify-center overflow-hidden rounded-lg bg-primary px-4 py-2 text-primary-foreground shadow-lg">
              {headings.length > 0 ? (
                <div 
                  key={activeHeadingIndex}
                  className="flex min-w-0 animate-in items-center gap-2 slide-in-from-right fade-in duration-500"
                >
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  <span className="min-w-0 truncate text-sm font-medium">
                    {headings[activeHeadingIndex] || "Empty notice message..."}
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </div>
              ) : (
                <span className="text-sm opacity-50 italic">No active notices</span>
              )}
              {headings.length > 0 && (
                <div className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-4000 ease-linear" style={{ width: '100%' }} key={`progress-${activeHeadingIndex}`} />
              )}
            </div>
            <p className="text-xs text-muted-foreground text-center italic">
              * This is a live preview of how notices will cycle on the website navbar.
            </p>
          </div>
        </div>
      </section>

      {/* Website Layout Preview */}
      <section className="min-w-0 space-y-4 overflow-hidden">
        <div className="flex flex-col gap-2 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
            Live Preview (Website Layout)
          </h2>
          <span className="w-fit rounded-full bg-primary/10 px-2 py-1 text-xs text-primary animate-pulse">
            Live View
          </span>
        </div>
        
        <div className="grid min-w-0 grid-cols-1 gap-4 md:h-[500px] md:grid-cols-12">
          {/* Main Carousel Preview */}
          <div className="group relative min-w-0 overflow-hidden rounded-2xl border-2 border-primary/20 bg-muted aspect-video md:col-span-8 md:aspect-auto">
            <div className="absolute top-2 left-2 z-10 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm">
              Carousel {currentCarouselIndex}/5
            </div>
            {(data as any)[`adImage${currentCarouselIndex}`] ? (
              <Image
                src={(data as any)[`adImage${currentCarouselIndex}`]}
                alt="Carousel Preview"
                fill
                className="object-cover transition-opacity duration-500"
                key={currentCarouselIndex}
              />
            ) : (
              <div className="flex h-full w-full min-w-0 flex-col items-center justify-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 opacity-20" />
                <span className="text-sm">No Carousel Image {currentCarouselIndex}</span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-colors group-hover:bg-black/40 group-hover:opacity-100">
              <Button size="sm" onClick={() => triggerUpload(`adImage${currentCarouselIndex}`)}>
                Change Slide {currentCarouselIndex}
              </Button>
            </div>
          </div>

          {/* Side Ads Preview */}
          <div className="grid min-w-0 grid-cols-1 gap-4 md:col-span-4 md:flex md:flex-col">
            {[6, 7].map((num) => (
              <div key={num} className="group relative min-w-0 flex-1 overflow-hidden rounded-2xl border-2 border-primary/20 bg-muted aspect-video md:aspect-auto">
                <div className="absolute top-2 left-2 z-10 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm">
                  Ad Banner {num === 6 ? 'A' : 'B'}
                </div>
                {(data as any)[`adImage${num}`] ? (
                  <Image
                    src={(data as any)[`adImage${num}`]}
                    alt={`Ad ${num}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full min-w-0 flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-8 w-8 opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-colors group-hover:bg-black/40 group-hover:opacity-100">
                  <Button size="sm" className="h-7 text-[10px]" onClick={() => triggerUpload(`adImage${num}`)}>
                    Change Ad {num === 6 ? 'A' : 'B'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="min-w-0 space-y-4 overflow-hidden">
        <div className="flex flex-col gap-2 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm text-primary">1-5</span>
            Homepage Carousel Banners
          </h2>
          <p className="text-sm italic text-muted-foreground">Recommended size: 1920x600px</p>
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((num) => (
            <ImageCard
              key={`adImage${num}`}
              id={`adImage${num}`}
              label={`Carousel Slide ${num}`}
              currentImage={(data as any)[`adImage${num}`]}
            />
          ))}
        </div>
      </section>

      <section className="min-w-0 space-y-4 overflow-hidden">
        <div className="flex flex-col gap-2 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm text-primary">6-7</span>
            Advertisement Sections
          </h2>
          <p className="text-sm italic text-muted-foreground">Recommended size: 400x400px</p>
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
          {[6, 7].map((num) => (
            <div key={`adImage${num}`} className="min-w-0 space-y-4 overflow-hidden">
              <ImageCard
                id={`adImage${num}`}
                label={`Ad Banner ${num === 6 ? 'A' : 'B'}`}
                currentImage={(data as any)[`adImage${num}`]}
              />
              <Card className="min-w-0 overflow-hidden border-2 border-dashed p-4">
                <div className="min-w-0 space-y-2">
                  <Label className="text-xs font-medium flex items-center gap-2">
                    <LinkIcon className="h-3 w-3" />
                    Ad Link (Click Destination)
                  </Label>
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
                    <Input 
                      placeholder="https://example.com/product"
                      defaultValue={(data as any)[`link${num - 5}`]}
                      id={`link-input-${num}`}
                      className="min-w-0"
                    />
                    <Button 
                      size="sm"
                      className="w-full sm:w-fit"
                      onClick={() => {
                        const val = (document.getElementById(`link-input-${num}`) as HTMLInputElement).value;
                        handleLinkUpdate(`link${num - 5}`, val);
                      }}
                      disabled={updatingLink === `link${num - 5}`}
                    >
                      {updatingLink === `link${num - 5}` ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
