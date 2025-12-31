#!/usr/bin/env python3
"""
Script pour générer l'attestation sur l'honneur de non-condamnation
pour la création de micro-entreprise
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from datetime import datetime
import sys

def generate_attestation(
    prenom_nom: str,
    date_naissance: str,
    lieu_naissance: str,
    adresse: str,
    prenom_nom_pere: str,
    prenom_nom_mere: str,
    ville: str,
    date_jour: str = None
):
    """
    Génère un PDF d'attestation sur l'honneur de non-condamnation
    """
    if date_jour is None:
        date_jour = datetime.now().strftime("%d/%m/%Y")
    
    # Nom du fichier de sortie
    output_file = "attestation_non_condamnation.pdf"
    
    # Créer le document PDF
    doc = SimpleDocTemplate(
        output_file,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm
    )
    
    # Styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        textColor='black',
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=12,
        textColor='black',
        spaceAfter=12,
        alignment=TA_LEFT,
        fontName='Helvetica'
    )
    
    # Contenu du document
    story = []
    
    # Titre
    story.append(Paragraph("ATTESTATION SUR L'HONNEUR DE NON-CONDAMNATION", title_style))
    story.append(Spacer(1, 0.5*cm))
    
    # Corps de l'attestation
    texte = f"""
    Je soussigné(e) <b>{prenom_nom}</b>,<br/>
    né(e) le <b>{date_naissance}</b> à <b>{lieu_naissance}</b>,<br/>
    demeurant <b>{adresse}</b>,<br/>
    <br/>
    déclare sur l'honneur :<br/>
    <br/>
    • N'avoir fait l'objet d'aucune condamnation pénale<br/>
    • N'avoir fait l'objet d'aucune sanction civile ou administrative de nature à interdire l'exercice d'une activité commerciale<br/>
    • Être le fils/fille de <b>{prenom_nom_pere}</b> et de <b>{prenom_nom_mere}</b><br/>
    <br/>
    Fait à <b>{ville}</b>, le <b>{date_jour}</b><br/>
    <br/>
    <br/>
    Signature : _________________________
    """
    
    story.append(Paragraph(texte, normal_style))
    
    # Générer le PDF
    doc.build(story)
    
    print(f"✅ PDF généré avec succès : {output_file}")
    print(f"📄 Vous pouvez maintenant l'imprimer, le signer et le scanner pour l'uploader.")
    
    return output_file

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Utilisation avec arguments en ligne de commande
        generate_attestation(
            prenom_nom=sys.argv[1],
            date_naissance=sys.argv[2],
            lieu_naissance=sys.argv[3],
            adresse=sys.argv[4],
            prenom_nom_pere=sys.argv[5],
            prenom_nom_mere=sys.argv[6],
            ville=sys.argv[7],
            date_jour=sys.argv[8] if len(sys.argv) > 8 else None
        )
    else:
        # Génération directe avec les informations de Yoann Marrale
        generate_attestation(
            prenom_nom="Yoann Marrale",
            date_naissance="27/01/2001",
            lieu_naissance="Martigues",
            adresse="Traverse Louise Michel, Bâtiment C6, Appartement 1, 13500 Martigues",
            prenom_nom_pere="Bruno Marrale",
            prenom_nom_mere="Christelle Rohaut",
            ville="Martigues",
            date_jour=None  # Sera mis automatiquement à aujourd'hui
        )

