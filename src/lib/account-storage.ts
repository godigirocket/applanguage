let owner = "guest";
let paused = false;
export function accountKey(key: string) {
  return `${key}:${owner}`;
}
export function accountOwner() {
  return owner;
}
export function selectAccount(userId: string | null) {
  owner = userId || "guest";
}
export function pauseAccountWrites(value: boolean) {
  paused = value;
}
export function accountWritesPaused() {
  return paused;
}
