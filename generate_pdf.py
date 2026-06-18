from fpdf import FPDF

pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=12)

text = """BotForge SaaS Company Return Policy

1. Return Window: Returns are allowed within 30 days of the original purchase date.
2. Condition: To be eligible for a return, your item must be unused and in the same condition that you received it.
3. Refund Processing: Refunds will be processed within 5-7 business days of receiving the returned item.
4. Shipping Costs: Shipping costs for returns are the responsibility of the customer unless the item was defective.
5. Support Contact: For any issues or support inquiries, please contact support@botforge.com.
"""

for line in text.split('\n'):
    pdf.cell(200, 10, txt=line, ln=1, align='L')

pdf.output("sample_return_policy.pdf")
print("PDF created successfully!")
