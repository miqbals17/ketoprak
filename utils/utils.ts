export function formatRTSP(
  ip: string,
  prefix = "rtsp://admin:CCtvp3rv121$@",
  suffix = ":554/video1",
): string {
  if (ip === "") return "";

  if (ip.startsWith("rtsp://")) {
    return ip;
  }

  return `${prefix}${ip}${suffix}`;
}
