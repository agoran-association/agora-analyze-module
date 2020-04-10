// import * as HtmlWebpack from 'html-webpack-plugin'
// @ts-ignore
const HtmlWebpack = require('html-webpack-plugin')

const CODE = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','{{GTM}}');</script>
<!-- End Google Tag Manager -->`.replace(/(\\r\\n|\n)/g, '');

export class GoogleTagManagePlugin {
  private gtm: string;

  constructor({ gtm }: any) {
    this.gtm = gtm;
  }

  apply(compiler: any) {
    compiler.hooks.compilation.tap(
      'GoogleTagManagePlugin',
      (compilation: any) => {
        HtmlWebpack.getHooks(compilation).afterTemplateExecution.tapAsync(
          'GoogleTagManagePlugin',
          ({html, ...props}: any, callback: any) => {
            const newHtml = html.replace(
              '</head>',
              CODE.replace('{{GTM}}', this.gtm) + '</head>',
            )
            callback(null, {html: newHtml, ...props})
          }
        )
      }
    )
  }
}
