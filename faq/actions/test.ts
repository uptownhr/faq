"use server";
interface Test {
  test: string;
}
export async function test(test: Test) {
  console.log("test", test);
}
