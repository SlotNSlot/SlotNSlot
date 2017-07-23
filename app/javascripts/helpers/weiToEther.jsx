export default function weiToEther(number) {
  return parseFloat((number / 10 ** 18).toFixed(2), 10);
}
