import { 
  mkdir, 
  access, 
  constants, 
  writeFile as nativeWriteFile 
} from 'node:fs/promises'
import { isAbsolute, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const getRealPath = (file, root) => isAbsolute(file) ? file : resolve(getDirname(root), file)

export const getDirname = (url) => dirname(fileURLToPath(url))

export async function exist(file) {
  return (await access(file, constants.F_OK).catch(() => false)) ?? true
}

export async function createDir(file, root) {
  const dir = getRealPath(file, root)

  if (!(await exist(dir))) {
    await mkdir(dir)
  }
}

export async function writeFile(file, content, root) {
  const realPath = getRealPath(file, root)
  const dir = dirname(realPath)
  await createDir(dir, root)
  return nativeWriteFile(realPath, content)
}