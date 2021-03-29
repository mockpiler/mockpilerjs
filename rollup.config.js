// @ts-check
import * as path from 'path'
import nodeExternals from 'rollup-plugin-node-externals'
import nodeResolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'

const PACKAGES_PATH = path.join(__dirname, 'packages')

const typeCompilerPackageName = 'type-compiler'
// Note: Here we can use fs.readdirSync, but we want
// to keep order of packages for declaration files
const packageNames = [
  'lexer',
  'code-frame',
  'parser',
  'context',
  'transform',
  'compiler',
  typeCompilerPackageName
]

/**
 * @type {import('rollup').RollupOptions['plugins']}
 */
const globalPlugins = [nodeResolve(), esbuild()]

/**
 * @type {import('rollup').RollupOptions[]}
 */
const config = packageNames
  .map(packageName => {
    const packagePath = path.join(PACKAGES_PATH, packageName)
    const isTypeCompilerPackageName = packageName === typeCompilerPackageName

    /**
     * @param {import('rollup').ModuleFormat} format
     *
     * @returns {import('rollup').OutputOptions}
     */
    const getOutputOptions = format => ({
      file: path.resolve(
        packagePath,
        `./dist/mockpiler-${packageName}.${
          format === 'es' ? 'd.ts' : format + '.js'
        }`
      ),
      format
    })

    const packageInputFile = path.resolve(
      packagePath,
      `./src/index${isTypeCompilerPackageName ? '.d' : ''}.ts`
    )

    /**
     * @type {import('rollup').RollupOptions[]}
     */
    const configs = [
      {
        input: packageInputFile,
        plugins: [dts()],
        output: getOutputOptions('es')
      }
    ]

    if (!isTypeCompilerPackageName) {
      configs.unshift({
        input: packageInputFile,
        plugins: [
          nodeExternals({
            packagePath: path.join(packagePath, 'package.json')
          }),
          ...globalPlugins
        ],
        output: [getOutputOptions('esm'), getOutputOptions('cjs')]
      })
    }

    return configs
  })
  .reduce((arr, arrItem) => [...arr, ...arrItem], [])

export default config
