import dayjs from "dayjs";

export const formatCurrency = (value: number, currency = "ARS"): string => {
  try {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
};

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "No especificado";
  const parsedDate = dayjs(value);
  return parsedDate.isValid()
    ? parsedDate.format("DD/MM/YYYY")
    : "No especificado";
};

const STATUS_LABELS: Record<string, string> = {
  active: "Activa",
  paused: "Pausada",
  cancelled: "Cancelada",
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Desconocido";
  return STATUS_LABELS[value.toLowerCase()] ?? (value.charAt(0).toUpperCase() + value.slice(1));
};
