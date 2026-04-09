import { Controller, Get, Param, Res, ParseIntPipe } from '@nestjs/common';
import type { Response } from 'express';
import { ProductsService } from '../products/products.service';

const SITE_URL = 'https://www.reboulstore.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

@Controller('og')
export class OgController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('product/:id')
  async productOg(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const product = await this.productsService.findOne(id);

      const title = `${product.name} | Reboul Store`;
      const description =
        product.description?.slice(0, 155) ||
        `${product.name} disponible sur Reboul Store.`;
      const image = product.images?.[0]?.url || DEFAULT_OG_IMAGE;
      const url = `${SITE_URL}/product/${id}`;
      const price = product.price ? `${product.price}` : undefined;

      const html = buildOgHtml({ title, description, image, url, price });
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.send(html);
    } catch {
      return res.redirect(301, `${SITE_URL}/product/${id}`);
    }
  }
}

function buildOgHtml(meta: {
  title: string;
  description: string;
  image: string;
  url: string;
  price?: string;
}): string {
  const priceTag = meta.price
    ? `<meta property="product:price:amount" content="${meta.price}" /><meta property="product:price:currency" content="EUR" />`
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}" />
<link rel="canonical" href="${esc(meta.url)}" />

<meta property="og:type" content="product" />
<meta property="og:site_name" content="Reboul Store" />
<meta property="og:title" content="${esc(meta.title)}" />
<meta property="og:description" content="${esc(meta.description)}" />
<meta property="og:url" content="${esc(meta.url)}" />
<meta property="og:image" content="${esc(meta.image)}" />
${priceTag}

</head>
<body>
<p><a href="${esc(meta.url)}">${esc(meta.title)}</a></p>
</body>
</html>`;
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
