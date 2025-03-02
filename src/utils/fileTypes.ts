/**
 * 파일이 JavaScript/TypeScript 관련 파일인지 확인합니다.
 * @param fileName 파일명
 * @returns JavaScript/TypeScript 파일 여부
 */
export function isJavaScriptOrTypeScript(fileName?: string): boolean {
  if (!fileName) return false;

  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  return ["js", "ts", "jsx", "tsx"].includes(extension);
}

/**
 * 파일 유형을 확인합니다 (코드 또는 마크다운).
 * @param fileName 파일명
 * @returns 파일 유형 ('code' 또는 'markdown')
 */
export function getFileType(fileName: string): "code" | "markdown" {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  return ["md", "markdown", "txt"].includes(extension) ? "markdown" : "code";
}
