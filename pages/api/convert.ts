import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { read, utils } from 'xlsx';
import { unlink } from 'fs/promises';
import Papa from 'papaparse';

// Deshabilitar el análisis del cuerpo de Next.js para la carga de archivos
export const config = {
  api: {
    bodyParser: false,
  },
};

// Interfaz para el formato de producto de Wix
interface WixProduct {
  handleId: string;
  fieldType: string;
  name: string;
  description: string;
  productImageUrl: string;
  collection: string;
  sku: string;
  ribbon: string;
  price: string;
  surcharge: string;
  visible: string;
  discountMode: string;
  discountValue: string;
  inventory: string;
  weight: string;
  cost: string;
  productOptionName1: string;
  productOptionType1: string;
  productOptionDescription1: string;
  productOptionName2: string;
  productOptionType2: string;
  productOptionDescription2: string;
  productOptionName3: string;
  productOptionType3: string;
  productOptionDescription3: string;
  productOptionName4: string;
  productOptionType4: string;
  productOptionDescription4: string;
  productOptionName5: string;
  productOptionType5: string;
  productOptionDescription5: string;
  productOptionName6: string;
  productOptionType6: string;
  productOptionDescription6: string;
  additionalInfoTitle1: string;
  additionalInfoDescription1: string;
  additionalInfoTitle2: string;
  additionalInfoDescription2: string;
  additionalInfoTitle3: string;
  additionalInfoDescription3: string;
  additionalInfoTitle4: string;
  additionalInfoDescription4: string;
  additionalInfoTitle5: string;
  additionalInfoDescription5: string;
  additionalInfoTitle6: string;
  additionalInfoDescription6: string;
  customTextField1: string;
  customTextCharLimit1: string;
  customTextMandatory1: string;
  brand: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    if (!file.originalFilename?.endsWith('.xlsx')) {
      return res.status(400).json({ error: 'Formato de archivo inválido. Solo se permiten archivos .xlsx' });
    }

    try {
      const workbook = read(file.filepath, { type: 'file' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);
      const baseNum = 22879800;

      const wixProducts: WixProduct[] = jsonData.map((row: any, index: number) => {
        const product: WixProduct = {
          handleId: `Product_${baseNum + index}`,
          fieldType: "Product",
          name: row['Nombre'] || '',
          description: '',
          productImageUrl: '',
          collection: row['Categorías'] ? row['Categorías'].toString().trim() : '',
          sku: row['SKU'] ? row['SKU'].toString().trim() : '',
          ribbon: '',
          // Ensure price is never empty and properly formatted
          price: row['Precio'] ? 
            row['Precio'].toString().replace(',', '.') : 
            '0',
          surcharge: '0',
          visible: row['Mostrar en tienda'] === 'No' || row['Mostrar en tienda'] === 0 || row['Mostrar en tienda'] === '0' ? 'FALSE' : 'TRUE',
          discountMode: '',
          discountValue: '',
          inventory: row['Stock'] ? row['Stock'].toString().replace(',', '.') : '0',
          weight: '',
          cost: '0',
          productOptionName1: '',
          productOptionType1: '',
          productOptionDescription1: '',
          productOptionName2: '',
          productOptionType2: '',
          productOptionDescription2: '',
          productOptionName3: '',
          productOptionType3: '',
          productOptionDescription3: '',
          productOptionName4: '',
          productOptionType4: '',
          productOptionDescription4: '',
          productOptionName5: '',
          productOptionType5: '',
          productOptionDescription5: '',
          productOptionName6: '',
          productOptionType6: '',
          productOptionDescription6: '',
          additionalInfoTitle1: '',
          additionalInfoDescription1: '',
          additionalInfoTitle2: '',
          additionalInfoDescription2: '',
          additionalInfoTitle3: '',
          additionalInfoDescription3: '',
          additionalInfoTitle4: '',
          additionalInfoDescription4: '',
          additionalInfoTitle5: '',
          additionalInfoDescription5: '',
          additionalInfoTitle6: '',
          additionalInfoDescription6: '',
          customTextField1: '',
          customTextCharLimit1: '',
          customTextMandatory1: '',
          brand: ''
        };

        // Map discount if exists
        const rawDiscountPrice = row['Precio oferta']?.toString().replace(',', '.') || '0';
        const discountPrice = Number(rawDiscountPrice);
        if (!isNaN(discountPrice) && discountPrice > 0) {
          product.discountMode = 'amount';
          product.discountValue = rawDiscountPrice;
        }

        // Map product attributes
        for (let i = 1; i <= 3; i++) {
          const name = row[`Nombre atributo ${i}`];
          const value = row[`Valor atributo ${i}`];
          if (name || value) {
            product[`productOptionName${i}` as keyof WixProduct] = name || '';
            product[`productOptionType${i}` as keyof WixProduct] = 'DROP_DOWN';
            product[`productOptionDescription${i}` as keyof WixProduct] = value || '';
          }
        }

        return product;
      });

      const columns = [
        'handleId', 'fieldType', 'name', 'description', 'productImageUrl',
        'collection', 'sku', 'ribbon', 'price', 'surcharge', 'visible',
        'discountMode', 'discountValue', 'inventory', 'weight', 'cost',
        'productOptionName1', 'productOptionType1', 'productOptionDescription1',
        'productOptionName2', 'productOptionType2', 'productOptionDescription2',
        'productOptionName3', 'productOptionType3', 'productOptionDescription3',
        'productOptionName4', 'productOptionType4', 'productOptionDescription4',
        'productOptionName5', 'productOptionType5', 'productOptionDescription5',
        'productOptionName6', 'productOptionType6', 'productOptionDescription6',
        'additionalInfoTitle1', 'additionalInfoDescription1',
        'additionalInfoTitle2', 'additionalInfoDescription2',
        'additionalInfoTitle3', 'additionalInfoDescription3',
        'additionalInfoTitle4', 'additionalInfoDescription4',
        'additionalInfoTitle5', 'additionalInfoDescription5',
        'additionalInfoTitle6', 'additionalInfoDescription6',
        'customTextField1', 'customTextCharLimit1', 'customTextMandatory1', 'brand'
      ];

      const csv = Papa.unparse({
        fields: columns,
        data: wixProducts.map(product => columns.map(col => {
          const value = product[col as keyof WixProduct];
          // Don't quote handleId and fieldType
          return value;
        }))
      }, {
        header: true,
        quotes: false, // Don't use quotes by default
        delimiter: ',',
        newline: '\n'
      });

      const cleanCsv = csv.trim();
      await unlink(file.filepath);

      // Get original filename without extension
      const originalName = file.originalFilename?.replace(/\.[^/.]+$/, '') || 'wix-import';
      const csvFilename = `${originalName}.csv`;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${csvFilename}"`);
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      return res.status(200).send(cleanCsv);

    } catch (error) {
      await unlink(file.filepath);
      throw error;
    }

  } catch (error) {
    console.error('Error al procesar el archivo:', error);
    return res.status(500).json({ error: 'Error al procesar el archivo' });
  }
}
