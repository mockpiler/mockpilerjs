// @ts-check
import * as path from 'path'
import nodeExternals from 'rollup-plugin-node-externals'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'

const PACKAGES_PATH = path.join(__dirname, 'packages')

// Note: Here we can use fs.readdirSync, but we want
// to keep order of packages for declaration files
const packageNames = [
  'lexer',
  'code-frame',
  'parser',
  'context',
  'transform',
  'compiler'
]

/**
 * @type {import('rollup').RollupOptions['plugins']}
 */
const globalPlugins = [
  nodeResolve(),
  typescript({
    useTsconfigDeclarationDir: false
  })
]

/**
 * @type {import('rollup').RollupOptions[]}
 */
const config = packageNames
  .map(packageName => {
    const packagePath = path.join(PACKAGES_PATH, packageName)

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

    const packageInputFile = path.resolve(packagePath, './src/index.ts')

    return [
      {
        input: packageInputFile,
        plugins: [
          nodeExternals({
            packagePath: path.join(packagePath, 'package.json')
          }),
          ...globalPlugins
        ],
        output: [getOutputOptions('esm'), getOutputOptions('cjs')]
      },
      {
        input: packageInputFile,
        plugins: [dts()],
        output: getOutputOptions('es')
      }
    ]
  })
  .reduce((arr, arrItem) => [...arr, ...arrItem], [])

export default config
