import { z } from "zod";
import { prisma } from "../lib/prisma";
import { Either, left, right } from "../utils/either";

const searchInvoiceRPSSchema = z.object({
  id: z.string(),
  invoiceId: z.string(),
  cnpj: z.string(),
  rps: z.string(),
  date: z.string(),
  customerCNPJ: z.string(),
  serie: z.string()
});

type SearchInvoiceRPSInterface = z.infer<typeof searchInvoiceRPSSchema>;
type SearchInvoiceRPSType = Either<string, SearchInvoiceRPSInterface>;

export async function searchInvoiceRPS(invoice: string): Promise<SearchInvoiceRPSType> {
  try {
    const invoiceRPS = await prisma.invoices.findUnique({
      where: {
        invoiceId: invoice
      }
    });

    if (!invoiceRPS) {
      return left("Invoice not found in the database");
    }

    const validation = searchInvoiceRPSSchema.safeParse(invoiceRPS);
    if (!validation.success) {
      return left("Invalid data format returned from the database");
    }

    return right(validation.data);
  } catch (error) {
    if (error instanceof Error) {
      return left(error.message);
    } else {
      return left("An unknown error occurred");
    }
  }
}
