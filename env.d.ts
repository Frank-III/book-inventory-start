/// <reference types="vinxi/types/client" />

interface ImportMetaEnv {
  DB: string
}
  
interface ImportMeta {
  readonly env: ImportMetaEnv
}
