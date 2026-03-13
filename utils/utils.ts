export function formatRTSP(
  ip: string,
  prefix = "rtsp://admin:CCtvp3rv121$@",
  suffix = ":554/video1",
): string {
  if (ip === "") return "";

  if (ip.startsWith("rtsp://")) {
    const sanitizedIp = ip
      .trim()
      .replace(/[\r\n\t]/g, "")
      .replace(/[\x00-\x1F\x7F]/g, "");

    return sanitizedIp;
  }

  const constructRtsp = `${prefix}${ip}${suffix}`;
  const sanitizedIp = constructRtsp
    .trim()
    .replace(/[\r\n\t]/g, "")
    .replace(/[\x00-\x1F\x7F]/g, "");

  return sanitizedIp;
}
