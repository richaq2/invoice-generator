import { Page, Text, View, Document,Image,Insert } from '@react-pdf/renderer';
import { styles } from './pdfStyles';
import { formatNumberAsCurrency } from './utils'

const InvoicePDF = ({ values,logo,signature }) => {
  console.log("InvoicePDF ",logo)
  console.log("InvoicePDF ",signature)
  return (
<Document>
    <Page style={styles.page}>
    <View style={styles.headerContainer}>
          {logo && <Image style={styles.logo} src={logo}  />}
          <Text style={styles.header}>Tax Invoice /Bill of Supply/Cash Memo</Text>
        </View>
      <View style={styles.details}>
        <View style={styles.tableRow}>
          <View style={styles.tableColInvoice}>
            <Text>Invoice No: {values.invoiceNo}</Text>
            <Text>Invoice Date: {values.invoiceDate}</Text>
          </View>
          <View style={styles.tableColInvoice}>
            <Text>Reverse Charge: {values.reverseCharge ? 'Yes' : 'No'}</Text>
            <Text>Invoice Details: {values.invoiceDetails}</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailsCol}>
          <Text style={styles.section}>Seller Details</Text>
          <View style={styles.sellerBuyerTable}>
            <View style={styles.sellerBuyerTableRow}>
              <View style={styles.sellerBuyerTableCol}><Text>{values.sellerName}</Text></View>
            </View>
            <View style={styles.sellerBuyerTableRow}>
              <View style={styles.sellerBuyerTableCol}><Text>{values.sellerAddress}</Text></View>
              <View style={styles.sellerBuyerTableCol}><Text>{values.sellerState}</Text></View>
            </View>
            <View style={styles.sellerBuyerTableRow}>
              <View style={styles.sellerBuyerTableColHeader}><Text style={{textDecoration:'underline'}}>State/UT Code:-</Text></View>
              <View style={styles.sellerBuyerTableCol}><Text>{values.sellerPincode}</Text></View>
            </View>
            <View style={styles.sellerBuyerTableRow}>
              <View style={styles.sellerBuyerTableColHeader}><Text style={{textDecoration:'underline'}}>PAN No:-</Text></View>
              <View style={styles.sellerBuyerTableCol}><Text>{values.sellerPAN}</Text></View>
            </View>
            <View style={styles.sellerBuyerTableRow}>
              <View style={styles.sellerBuyerTableColHeader}><Text style={{textDecoration:'underline'}}>GST Registration No:-</Text></View>
              <View style={styles.sellerBuyerTableCol}><Text>{values.sellerGST}</Text></View>
            </View>
          </View>
        </View>

        <View style={styles.detailsCol}>
          <Text style={styles.section} >Buyer Details</Text>
          <View style={styles.sellerBuyerTable}>
            <View style={styles.sellerBuyerTableRow}>
              <View style={styles.sellerBuyerTableCol}><Text>{values.buyerName}</Text></View>
            </View>
            <View style={styles.sellerBuyerTableRow}>
              <View style={styles.sellerBuyerTableCol}><Text>{values.buyerAddress}</Text></View>
              <View style={styles.sellerBuyerTableCol}><Text>{values.buyerCity}</Text></View>
              <View style={styles.sellerBuyerTableCol}><Text>{values.buyerState}</Text></View>
            </View>
            <View style={styles.sellerBuyerTableRow}>
              <View style={styles.sellerBuyerTableColHeader}><Text style={{textDecoration:'underline'}}>State/UT Code</Text></View>
              <View style={styles.sellerBuyerTableCol}><Text>{values.buyerStateCode}</Text></View>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.section}>Item Details</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
        <View style={styles.tableColHeader}><Text>S/N</Text></View>
          <View  style={styles.tableColDescriptionheader}><Text>Description</Text></View>
          <View style={styles.tableColHeader}><Text>Unit Price</Text></View>
          <View style={styles.tableColHeader}><Text>Quantity</Text></View>
          <View style={styles.tableColHeader}><Text>Discount</Text></View>
          <View style={styles.tableColHeader}><Text>Net Amount</Text></View>
          <View style={styles.tableColHeader}><Text>Tax Rate</Text></View>
          <View style={styles.tableColHeader}><Text>Tax Amount</Text></View>
          <View style={styles.tableColHeader}><Text>Total Amount</Text></View>
        </View>
        {values.items.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}><Text>{index + 1}</Text></View>
            <View style={styles.tableColDescription}><Text>{item.description}</Text></View>
            <View style={styles.tableCol}><Text>{item.unitPrice}</Text></View>
            <View style={styles.tableCol}><Text>{item.quantity}</Text></View>
            <View style={styles.tableCol}><Text>{item.discount}</Text></View>
            <View style={styles.tableCol}><Text>{item.netAmount}</Text></View>
            <View style={styles.tableCol}><Text>{item.taxRate}%</Text></View>
            <View style={styles.tableCol}><Text>{item.taxAmount}</Text></View>
            <View style={styles.tableCol}><Text>{item.totalAmount}</Text></View>
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <Text>For {values.sellerName}:</Text>
        {signature && <Image style={styles.signatureImage} src={signature} />}
        <Text>Authorised Signatory</Text>
      </View>

      <Text style={styles.section}>Total Amount in Words:z</Text>
    </Page>
  </Document>
  );
};

export default InvoicePDF;
