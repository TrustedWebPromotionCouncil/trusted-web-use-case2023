/** 型情報に基づいたパース処理 */
export interface Serializable<T> {
  deserialize(input: any): T;
}
