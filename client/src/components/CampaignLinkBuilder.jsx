import React, { useMemo, useState } from "react";

const PLATFORM_OPTIONS = [
  "tiktok",
  "pinterest",
  "instagram",
  "youtube",
  "blog",
  "email",
  "direct",
];

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CampaignLinkBuilder({ products, redirectBaseUrl }) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [campaignName, setCampaignName] = useState("");
  const [variant, setVariant] = useState("");
  const [copied, setCopied] = useState(false);

  const activeProducts = products.filter((product) => product.active);

  const generatedLink = useMemo(() => {
    if (!selectedProductId) {
      return "";
    }

    const parts = [
      slugify(platform),
      slugify(campaignName),
      slugify(variant),
    ].filter(Boolean);

    const sourceValue = parts.join("-");
    return `${redirectBaseUrl}/out/${selectedProductId}?src=${encodeURIComponent(sourceValue || "direct")}`;
  }, [selectedProductId, platform, campaignName, variant, redirectBaseUrl]);

  async function handleCopy() {
    if (!generatedLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  }

  return (
    <div className="stats-panel">
      <h3>Campaign Link Builder</h3>

      <div className="link-builder-grid">
        <div>
          <label className="field-label">Product</label>
          <select
            value={selectedProductId}
            onChange={(event) => setSelectedProductId(event.target.value)}
          >
            <option value="">Select a product</option>
            {activeProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">Platform</label>
          <select
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
          >
            {PLATFORM_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">Campaign Name</label>
          <input
            type="text"
            value={campaignName}
            onChange={(event) => setCampaignName(event.target.value)}
            placeholder="green-fit-check"
          />
        </div>

        <div>
          <label className="field-label">Variant</label>
          <input
            type="text"
            value={variant}
            onChange={(event) => setVariant(event.target.value)}
            placeholder="video-1"
          />
        </div>
      </div>

      <div className="generated-link-box">
        <label className="field-label">Generated Link</label>
        <input type="text" value={generatedLink} readOnly placeholder="Generated link will appear here" />
      </div>

      <div className="form-actions">
        <button type="button" onClick={handleCopy} disabled={!generatedLink}>
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}