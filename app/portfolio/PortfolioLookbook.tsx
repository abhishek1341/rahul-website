"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface Client {
  id: string;
  name: string;
  desc: string;
  tags: string[];
  niches: string[];
  logo: string;
}

interface Niche {
  id: string;
  label: string;
  icon: string;
}

interface PortfolioVideo {
  id: number;
  title: string;
  subtitle: string;
  thumb: string;
}

type PortfolioVideos = Record<string, Record<string, PortfolioVideo[]>>;

interface PortfolioLookbookProps {
  clients: Client[];
  niches: Niche[];
  portfolioVideos: PortfolioVideos;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Checkmark() {
  return (
    <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#7C5CFF] text-[11px] font-semibold leading-none text-text-inverse">
      ✓
    </span>
  );
}

function ProgressTabs({
  count,
  activeIndex,
}: {
  count: number;
  activeIndex: number;
}) {
  return (
    <div
      className="flex shrink-0"
      style={{ padding: "10px 14px 6px", gap: "4px" }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          style={{
            flex: 1,
            height: "3px",
            borderRadius: "2px",
            background:
              index === activeIndex ? "#7C5CFF" : "rgba(124,92,255,0.25)",
          }}
        />
      ))}
    </div>
  );
}

function EmptyViewerState() {
  return (
    <div className="mt-4 flex min-h-[280px] items-center justify-center rounded-[16px] border-[1.5px] border-dashed border-[#C8C3BB] p-12 text-center">
      <div>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F3EFE8] text-[20px] text-text-primary">
          ▶
        </div>
        <p className="mx-auto mt-4 max-w-[260px] text-[14px] leading-[1.5] text-text-muted">
          Select a client and service above to view portfolio videos
        </p>
      </div>
    </div>
  );
}

export default function PortfolioLookbook({
  clients,
  niches,
  portfolioVideos,
}: PortfolioLookbookProps) {
  const [selectedClient, setSelectedClient] = useState("vrundavan");
  const [selectedNiche, setSelectedNiche] = useState<string | null>("reels");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});
  const [failedThumbs, setFailedThumbs] = useState<Record<string, boolean>>({});
  const stepTwoRef = useRef<HTMLElement>(null);
  const stepThreeRef = useRef<HTMLElement>(null);

  const selectedClientData =
    clients.find((client) => client.id === selectedClient) ?? null;
  const viewerNicheId = selectedNiche ?? selectedClientData?.niches[0] ?? null;
  const viewerNicheData = niches.find((niche) => niche.id === viewerNicheId) ?? null;
  const visibleNiches = selectedClientData
    ? niches.filter((niche) => selectedClientData.niches.includes(niche.id))
    : niches;
  const activeVideos =
    selectedClient && viewerNicheId
      ? portfolioVideos[selectedClient]?.[viewerNicheId] ?? []
      : [];
  const activeVideoIndex =
    activeVideos.length > 0 ? currentVideoIndex % activeVideos.length : 0;
  const currentVideo = activeVideos[activeVideoIndex] ?? null;

  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId);
    setSelectedNiche(null);
    setCurrentVideoIndex(0);

    requestAnimationFrame(() => {
      stepTwoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleNicheSelect = (nicheId: string) => {
    if (!selectedClientData) return;

    setSelectedNiche(nicheId);
    setCurrentVideoIndex(0);

    if (window.matchMedia("(max-width: 767px)").matches) {
      requestAnimationFrame(() => {
        stepThreeRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  };

  const markLogoFailed = (clientId: string) => {
    setFailedLogos((current) => ({ ...current, [clientId]: true }));
  };

  const markThumbFailed = (video: PortfolioVideo) => {
    setFailedThumbs((current) => ({
      ...current,
      [`${selectedClient}-${viewerNicheId}-${video.id}`]: true,
    }));
  };

  const goToVideo = (direction: -1 | 1) => {
    if (activeVideos.length === 0) return;

    setCurrentVideoIndex((index) => {
      const nextIndex = index + direction;
      return (nextIndex + activeVideos.length) % activeVideos.length;
    });
  };

  const renderLogo = (client: Client, size: 26 | 48 | 82) => {
    const dimensions =
      size === 82 ? "h-[82px] w-[82px]" : size === 48 ? "h-12 w-12" : "h-[26px] w-[26px]";
    const textSize = size === 26 ? "text-[10px]" : "text-[13px]";
    const logoFitClass =
      size === 82 ? "bg-[#F5F2EE] object-contain p-1" : size === 26 ? "object-contain" : "object-cover";

    if (failedLogos[client.id]) {
      return (
        <div
          className={`${dimensions} ${textSize} flex shrink-0 items-center justify-center rounded-full bg-bg-base font-semibold text-text-primary`}
        >
          {getInitials(client.name)}
        </div>
      );
    }

    return (
      <Image
        src={client.logo}
        alt={`${client.name} logo`}
        width={size}
        height={size}
        className={`${dimensions} shrink-0 rounded-full ${logoFitClass}`}
        onError={() => markLogoFailed(client.id)}
      />
    );
  };

  const renderVideoVisual = (
    video: PortfolioVideo,
    wrapperClassName: string,
    imageClassName = "h-full w-full object-cover",
    placeholder: "full" | "initials" = "full"
  ) => {
    const thumbKey = `${selectedClient}-${viewerNicheId}-${video.id}`;

    if (failedThumbs[thumbKey]) {
      return (
        <div
          className={`${wrapperClassName} flex items-center justify-center overflow-hidden text-center ${
            placeholder === "initials"
              ? "bg-[#D4CFC8] text-[12px] font-bold text-text-muted"
              : "bg-[#D8D3CB] p-4 text-[13px] font-medium text-text-muted"
          }`}
        >
          {placeholder === "initials" ? getInitials(video.title) : video.title}
        </div>
      );
    }

    return (
      <div className={`bg-[#D8D3CB] ${wrapperClassName}`}>
        <img
          src={video.thumb}
          alt={video.title}
          className={imageClassName}
          onError={() => markThumbFailed(video)}
        />
      </div>
    );
  };

  return (
    <main
      className="bg-bg-base"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "20px 48px 0",
        boxSizing: "border-box",
      }}
      data-selected-client={selectedClient ?? ""}
      data-selected-niche={selectedNiche ?? ""}
      data-current-video-index={currentVideoIndex}
    >
      <style>
        {`@keyframes portfolioFade { from { opacity: 0; } to { opacity: 1; } }`}
      </style>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          border: "1px solid color-mix(in srgb, var(--text-primary) 20%, transparent)",
          borderRadius: "999px",
          padding: "6px 14px",
          fontSize: "11px",
          fontWeight: "500",
          letterSpacing: "0.06em",
          width: "fit-content",
          alignSelf: "flex-start",
          color: "var(--text-primary)",
        }}
      >
        ✳ SUNTRIX MEDIA
      </div>

      <h1
        className="font-medium leading-none text-text-primary"
        style={{ marginTop: "8px", fontSize: "clamp(36px, 4.25vw, 56px)", letterSpacing: "-0.06em" }}
      >
        Portfolio
      </h1>

      <p
        className="max-w-[480px] text-text-muted"
        style={{ marginTop: "6px", marginBottom: "28px", fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.9px", whiteSpace: "nowrap" }}
      >
        Select a client, choose a service or niche, then browse portfolio videos in a story-style sequence.
      </p>

      <div
        className="flex flex-col xl:flex-row"
        style={{
          flex: 1,
          gap: "48px",
          alignItems: "flex-start",
          minHeight: 0,
          marginTop: "0",
        }}
      >
        <div className="w-full xl:w-[620px] xl:shrink-0">
          <section>
            <div className="flex items-center gap-3">
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#7C5CFF',
                color: "var(--text-inverse)",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '600',
                flexShrink: 0
              }}>1</div>
              <span className="shrink-0 text-[18px] font-semibold text-text-primary">
                Select Client
              </span>
              <span className="h-px flex-1 bg-text-primary/10" />
            </div>

            <div
              className="hidden md:grid"
              style={{
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "14px",
                marginTop: "14px",
              }}
            >
              {clients.map((client) => {
                const isSelected = selectedClient === client.id;

                return (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => handleClientSelect(client.id)}
                    className={`relative cursor-pointer bg-text-inverse text-center transition duration-150 hover:scale-[1.02] ${
                      isSelected
                        ? "border-2 border-[#7C5CFF]"
                        : "border border-bg-surface"
                    }`}
                    style={{
                      minHeight: "230px",
                      padding: "22px 18px 18px",
                      borderRadius: "16px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: 0,
                    }}
                  >
                    {isSelected && (
                      <span className="absolute right-3 top-3">
                        <Checkmark />
                      </span>
                    )}
                    <div className="mx-auto flex justify-center">
                      {renderLogo(client, 82)}
                    </div>
                    <div className="text-[15px] font-semibold leading-tight text-text-primary" style={{ marginTop: "12px", textAlign: "center" }}>
                      {client.name}
                    </div>
                    <div className="text-[13px] leading-snug text-text-muted" style={{ marginTop: "4px", textAlign: "center" }}>
                      {client.desc}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        overflow: "hidden",
                        gap: "5px",
                        alignItems: "center",
                        marginTop: "auto",
                        paddingTop: "10px",
                        width: "100%",
                      }}
                    >
                      {client.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: "10px",
                            padding: "2px 7px",
                            borderRadius: "999px",
                            background: "#F0EBE4",
                            color: "var(--text-muted)",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-2 md:hidden">
              {clients.map((client) => {
                const isSelected = selectedClient === client.id;

                return (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => handleClientSelect(client.id)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-[12px] bg-text-inverse px-4 py-[14px] text-left transition duration-150 ${
                      isSelected
                        ? "border-2 border-[#7C5CFF]"
                        : "border border-bg-surface"
                    }`}
                  >
                    {renderLogo(client, 48)}
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-semibold leading-tight text-text-primary">
                        {client.name}
                      </span>
                      <span className="mt-1 block text-[13px] leading-snug text-text-muted">
                        {client.desc}
                      </span>
                      <span className="mt-2 flex flex-wrap gap-2">
                        {client.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[#F3EFE8] px-[10px] py-[3px] text-[11px] leading-none text-text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </span>
                    </span>
                    {isSelected ? (
                      <Checkmark />
                    ) : (
                      <span className="text-[20px] leading-none text-[#999]">
                        &gt;
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section
            ref={stepTwoRef}
            className="border-t border-text-primary/10 md:border-t-0"
            style={{ marginTop: "16px" }}
          >
            <div className="flex items-center gap-3">
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#7C5CFF',
                color: "var(--text-inverse)",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '600',
                flexShrink: 0
              }}>2</div>
              <span className="shrink-0 text-[18px] font-semibold text-text-primary">
                Choose Niche / Service
              </span>
              <span className="h-px flex-1 bg-text-primary/10" />
            </div>

            <div className="flex flex-wrap" style={{ gap: "12px", marginTop: "12px" }}>
              {visibleNiches.map((niche) => {
                const isSelected = selectedNiche === niche.id;
                const isDisabled = !selectedClientData;

                return (
                  <button
                    key={niche.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleNicheSelect(niche.id)}
                    className={`group flex flex-col items-center text-center ${
                      isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center rounded-full border-[1.5px] transition-colors ${
                        isSelected
                          ? "border-[#7C5CFF] bg-[#7C5CFF] text-text-inverse"
                          : isDisabled
                            ? "border-[#D8D3CB] bg-text-inverse text-[#999]"
                            : "border-[#D8D3CB] bg-text-inverse text-text-primary group-hover:bg-[#F3EFE8]"
                      }`}
                      style={{ width: "60px", height: "60px", fontSize: "18px" }}
                    >
                      {niche.icon}
                    </span>
                    <span
                      style={{
                        marginTop: "6px",
                        fontSize: "12px",
                        color: isSelected ? "var(--text-primary)" : "var(--text-muted)",
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {niche.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <section
          ref={stepThreeRef}
          className="w-full border-t border-text-primary/10 xl:w-auto xl:border-t-0"
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "0" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#7C5CFF',
              color: "var(--text-inverse)",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: '600',
              flexShrink: 0
            }}>3</div>
            <span style={{ fontSize: "16px", fontWeight: "600", color: "#111111" }}>
              View Portfolio Videos
            </span>
            <span style={{ fontSize: "14px", color: "var(--text-muted)", marginLeft: "4px" }}>↓</span>
          </div>

          {!selectedClientData || !viewerNicheData || !currentVideo ? (
            <EmptyViewerState />
          ) : (
            <>
              <div className="relative hidden md:block" style={{ marginTop: "14px", width: "305px" }}>
                <div className="absolute left-[-68px] top-[40%] z-10 flex -translate-y-1/2 flex-col items-center gap-[6px]">
                  <button
                    type="button"
                    onClick={() => goToVideo(-1)}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#D8D3CB] bg-text-inverse text-[18px] text-text-primary"
                    aria-label="Previous video"
                  >
                    ‹
                  </button>
                  <div className="text-center text-[11px] leading-tight text-text-muted">
                    Previous<br />Video
                  </div>
                </div>

                <div
                  className="relative mx-auto overflow-hidden rounded-[40px] border-[8px] border-[#111111] bg-text-primary"
                  style={{ width: "305px", height: "calc(100vh - 265px)", maxHeight: "520px", minHeight: "400px" }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "22px",
                      borderRadius: "12px",
                      background: "#111",
                      position: "absolute",
                      top: "10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 10,
                    }}
                  />
                  <div className="flex h-full flex-col overflow-hidden rounded-[36px] bg-text-inverse" style={{ height: "100%" }}>
                    <ProgressTabs
                      count={activeVideos.length}
                      activeIndex={activeVideoIndex}
                    />

                    <div
                      className="flex items-center gap-2"
                      style={{ flexShrink: 0, height: "44px", padding: "0 12px" }}
                    >
                      {renderLogo(selectedClientData, 26)}
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-semibold leading-[1.2] text-text-primary">
                          {selectedClientData.name}
                        </div>
                        <div className="text-[11px] font-medium leading-[1.2] text-text-muted">
                          {viewerNicheData.label}
                        </div>
                      </div>
                    </div>

                    <div
                      key={`${selectedClient}-${viewerNicheId}-${currentVideo.id}-${activeVideoIndex}`}
                      className="min-h-0 flex-1"
                      style={{ animation: "portfolioFade 200ms ease" }}
                    >
                      {renderVideoVisual(
                        currentVideo,
                        "h-full w-full overflow-hidden"
                      )}
                    </div>

                    <div style={{ flexShrink: 0 }}>
                      <h3 style={{ padding: "10px 12px 2px", fontSize: "13px", fontWeight: 600, color: "#111", lineHeight: 1.3 }}>
                        {currentVideo.title}
                      </h3>
                      <p style={{ padding: "0 12px 8px", fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.4 }}>
                        {currentVideo.subtitle}
                      </p>

                      <div style={{ display: "flex", padding: "6px 10px 10px", gap: "6px", overflowX: "hidden" }}>
                        {activeVideos.map((video, index) => (
                          <button
                            key={video.id}
                            type="button"
                            onClick={() => setCurrentVideoIndex(index)}
                            className="overflow-hidden"
                            style={{
                              width: "56px",
                              height: "56px",
                              borderRadius: "8px",
                              flexShrink: 0,
                              cursor: "pointer",
                              border: index === activeVideoIndex ? "2px solid #7C5CFF" : "1.5px solid transparent",
                            }}
                            aria-label={`View ${video.title}`}
                          >
                            {renderVideoVisual(video, "h-full w-full", "h-full w-full object-cover", "initials")}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute right-[-68px] top-[40%] z-10 flex -translate-y-1/2 flex-col items-center gap-[6px]">
                  <button
                    type="button"
                    onClick={() => goToVideo(1)}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#D8D3CB] bg-text-inverse text-[18px] text-text-primary"
                    aria-label="Next video"
                  >
                    ›
                  </button>
                  <div className="text-center text-[11px] leading-tight text-text-muted">
                    Next<br />Video
                  </div>
                </div>
              </div>

              <div className="md:hidden">
                <div className="mt-4 overflow-hidden rounded-[20px] border border-bg-surface bg-text-inverse">
                  <ProgressTabs
                    count={activeVideos.length}
                    activeIndex={activeVideoIndex}
                  />

                  <div className="flex items-center gap-2 px-4 py-[14px]">
                    {renderLogo(selectedClientData, 26)}
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-semibold leading-tight text-text-primary">
                        {selectedClientData.name}
                      </div>
                      <div className="text-[11px] leading-tight text-text-muted">
                        {viewerNicheData.label}
                      </div>
                    </div>
                  </div>

                  <div
                    key={`${selectedClient}-${viewerNicheId}-${currentVideo.id}-${activeVideoIndex}-mobile`}
                    style={{ animation: "portfolioFade 200ms ease" }}
                  >
                    {renderVideoVisual(
                      currentVideo,
                      "aspect-[4/3] w-full overflow-hidden"
                    )}

                    <div className="px-4 py-[14px]">
                      <h3 className="text-[14px] font-semibold leading-tight text-text-primary">
                        {currentVideo.title}
                      </h3>
                      <p className="mt-1 text-[12px] leading-snug text-text-muted">
                        {currentVideo.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-[6px] overflow-x-auto px-3 py-2">
                    {activeVideos.map((video, index) => (
                      <button
                        key={video.id}
                        type="button"
                        onClick={() => setCurrentVideoIndex(index)}
                        className={`h-16 w-16 shrink-0 overflow-hidden rounded-[10px] ${
                          index === activeVideoIndex
                            ? "border-2 border-[#7C5CFF]"
                            : "border border-transparent"
                        }`}
                        aria-label={`View ${video.title}`}
                      >
                        {renderVideoVisual(video, "h-full w-full", "h-full w-full object-cover", "initials")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => goToVideo(-1)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] text-[20px] text-text-inverse"
                    aria-label="Previous video"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => goToVideo(1)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] text-[20px] text-text-inverse"
                    aria-label="Next video"
                  >
                    ›
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
