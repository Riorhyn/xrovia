const PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAIAAABt+uBvAAABfElEQVR42u3cUY7CMAyE4VyGk3F8DlFeEUJItGPPmPzRPm89H7tq4iSsg/F1LAgAAggggAACCCCAGAABBBBAAAEEEECMs0C3++Piz/WKm2tY4fXZn75GVGl87ppSq+tTsQH9VHHz4zRvsbaijTpXX/MNdXt1BPOg6urtEwvBRLEuQ8K0KwLoYxL7P5dyqSEPE6KjXIsJI+XoiBerkmBROnFAaX8++naHJFWOTkk/SJIqRKeqYSZJlaATAVQNHdpy7V+LzetJqyIZdcqb9qpILp2OXQ1VJIuOB8hunQX0FkzL3VB808ahME+nzjF0Z7VN52DrGSCAAAIIIIAAAoiJIksNFqszgWh3NKX6z4YZLdfzqXZv2rPto0m16cYhW89Knb0OL3D8pUpniwNUHMEr15H/qhQgjgG36kQZcRWhGIjLLObqB1+H4kJdUNHzrmRyqTex1hnXwvligeiX7pH/1RS7DYAAAggggAACCCCAGAABBBBAAAEEEECMl/EEZEr4kRRvBp8AAAAASUVORK5CYII=";

export const dynamic = "force-static";

export function GET() {
  return new Response(Buffer.from(PNG_BASE64, "base64"), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
