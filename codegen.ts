import { CodegenConfig } from '@graphql-codegen/cli'
//📄https://the-guild.dev/graphql/codegen/docs/config-reference/codegen-config
const config: CodegenConfig = {
 overwrite:true, 
 schema: 'http://localhost:4000/graphql',
 documents: ['./src/**/*.{tsx,ts}'],
 generates: {
  './src/__generated__/types.ts': {
  plugins: ['typescript', 'typescript-operations']
  }
 }
}

export default config
