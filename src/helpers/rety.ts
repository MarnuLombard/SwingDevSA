export async function retry<T>(callback: Function, times: number, otherwise?: Function): Promise<T|undefined> {
  while (times >= 1) {
    try {
      return await callback();
    } catch (e) {
      // tslint:disable-next-line:no-parameter-reassignment
      times -= 1;
    }
  }

  return typeof otherwise === 'function' ? otherwise() : undefined;
}
