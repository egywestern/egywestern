import crypto from "node:crypto";

const COUNTRY_CODES: Record<string, string> = {
  EGYPT: "EG",
  "SAUDI ARABIA": "SA",
  "UNITED ARAB EMIRATES": "AE",
  "UNITED STATES": "US",
};

export function countryCode(country: string) {
  return COUNTRY_CODES[country.toUpperCase()] || "EG";
}

const HMAC_FIELDS = [
  "amount_cents",
  "created_at",
  "currency",
  "error_occured",
  "has_parent_transaction",
  "id",
  "integration_id",
  "is_3d_secure",
  "is_auth",
  "is_capture",
  "is_refunded",
  "is_standalone_payment",
  "is_voided",
  "order.id",
  "owner",
  "pending",
  "source_data.pan",
  "source_data.sub_type",
  "source_data.type",
  "success",
];

function getPath(obj: Record<string, unknown>, path: string) {
  return path
    .split(".")
    .reduce<unknown>(
      (value, key) =>
        value && typeof value === "object"
          ? (value as Record<string, unknown>)[key]
          : undefined,
      obj,
    );
}

export function verifyPaymobHmac(
  transaction: Record<string, unknown>,
  receivedHmac: string,
  secret: string,
) {
  const concatenated = HMAC_FIELDS.map((field) => {
    const value = getPath(transaction, field);
    return value === undefined || value === null ? "" : String(value);
  }).join("");
  const computed = crypto
    .createHmac("sha512", secret)
    .update(concatenated)
    .digest("hex");
  const a = Buffer.from(computed);
  const b = Buffer.from(receivedHmac || "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
