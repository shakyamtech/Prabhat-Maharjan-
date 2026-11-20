from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_RIGHT, TA_LEFT, TA_CENTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib import colors

output_path = r"d:\Developing\Prabhat Maharjan\domain-registration\cover-letter.pdf"

doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    rightMargin=25*mm,
    leftMargin=25*mm,
    topMargin=25*mm,
    bottomMargin=20*mm,
)

styles = getSampleStyleSheet()

# Custom styles
normal = ParagraphStyle(
    'CustomNormal',
    parent=styles['Normal'],
    fontName='Times-Roman',
    fontSize=12,
    leading=22,
    spaceAfter=0,
)

bold = ParagraphStyle(
    'CustomBold',
    parent=normal,
    fontName='Times-Bold',
)

justify = ParagraphStyle(
    'Justify',
    parent=normal,
    alignment=TA_JUSTIFY,
    spaceAfter=12,
)

right = ParagraphStyle(
    'Right',
    parent=normal,
    alignment=TA_RIGHT,
)

subject_style = ParagraphStyle(
    'Subject',
    parent=normal,
    fontName='Times-Bold',
    spaceAfter=16,
)

story = []

# Date & Location
story.append(Paragraph("Kathmandu, Nepal", right))
story.append(Paragraph("November 19, 2026", right))
story.append(Spacer(1, 16))

# To section
story.append(Paragraph("<b>To,</b>", normal))
story.append(Paragraph("The Hostmaster", normal))
story.append(Paragraph("Mercantile Communications Pvt. Ltd.", normal))
story.append(Paragraph("Durbar Marg, Kathmandu, Nepal", normal))
story.append(Paragraph("Email: hostmaster@mos.com.np", normal))
story.append(Spacer(1, 16))

# Subject
story.append(Paragraph(
    "<b><u>Subject: Request for Registration of Domain Name — prabhatmaharjan.com.np</u></b>",
    normal
))
story.append(Spacer(1, 14))

# Salutation
story.append(Paragraph("Dear Sir/Madam,", normal))
story.append(Spacer(1, 10))

# Body paragraphs
story.append(Paragraph(
    "I, <b>Prabhat Maharjan</b>, am writing to formally request the registration of the domain name "
    "<b><i>prabhatmaharjan.com.np</i></b> under my name for personal use as an artist and musician "
    "portfolio website.",
    justify
))

story.append(Paragraph(
    "I am a Nepali citizen residing in Kirtipur Municipality-14, Kathmandu. I wish to establish an "
    "official online presence under my name to showcase my music, studio services, live show bookings, "
    "and artist portfolio.",
    justify
))

story.append(Paragraph(
    "The requested domain name <b><i>prabhatmaharjan.com.np</i></b> directly corresponds to my full "
    "legal name as mentioned in my National Identity Card (NID), a copy of which is enclosed herewith "
    "for your verification.",
    justify
))

story.append(Paragraph(
    "Kindly process this domain registration request at your earliest convenience. I hereby confirm "
    "that all information provided is accurate and I agree to abide by the terms and conditions set "
    "forth by the .NP domain registry.",
    justify
))

story.append(Paragraph("Thank you for your time and assistance.", justify))
story.append(Spacer(1, 20))

# Closing
story.append(Paragraph("Yours sincerely,", normal))
story.append(Spacer(1, 48))

# Signature block
story.append(HRFlowable(width=180, thickness=1, color=colors.black))
story.append(Spacer(1, 4))
story.append(Paragraph("<b>Prabhat Maharjan</b>", normal))
story.append(Paragraph("NID No: 719-880-9063", normal))
story.append(Paragraph("Address: Kirtipur Municipality-14, Kathmandu", normal))
story.append(Paragraph("Contact: [Your Phone Number]", normal))
story.append(Paragraph("Email: [Your Email Address]", normal))
story.append(Spacer(1, 24))

# Footer note
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.grey, dash=(3,3)))
story.append(Spacer(1, 6))

footer_style = ParagraphStyle('Footer', parent=normal, fontSize=10, textColor=colors.grey, alignment=TA_CENTER)
story.append(Paragraph("Enclosure: Copy of National Identity Card (Front &amp; Back)", footer_style))

doc.build(story)
print(f"PDF created: {output_path}")
