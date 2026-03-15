import type { BackendResponse } from "../interfaces/connection";
import type { JumpcloudStatus } from "../interfaces/jumpcloud";
import type { PemantauanStatus } from "../interfaces/sipgn";

export const getJumpcloudStatus = async (
  jcNames: string[],
): Promise<JumpcloudStatus[]> => {
  try {
    const response = await fetch("http://localhost:4000/api/jumpcloud/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: jcNames }),
    });

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPemantauanCctv = async (
  sppgCodes: string[],
): Promise<PemantauanStatus[]> => {
  try {
    const response = await fetch("http://localhost:4000/api/pemantauan/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: sppgCodes }),
    });

    const { data } = (await response.json()) as BackendResponse<
      PemantauanStatus[]
    >;

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
