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
    date_jour: str = None,
    titre: str = "ATTESTATION SUR L'HONNEUR DE NON-CONDAMNATION",
    output_file: str = "attestation_non_condamnation.pdf"
):
    """
    Génère un PDF d'attestation sur l'honneur de non-condamnation
    """
    if date_jour is None:
        date_jour = datetime.now().strftime("%d/%m/%Y")
    
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
    story.append(Paragraph(titre, title_style))
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
    
    return output_file

def generate_all_versions(
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
    Génère les 3 versions de l'attestation pour le Guichet Unique
    """
    if date_jour is None:
        date_jour = datetime.now().strftime("%d/%m/%Y")
    
    # Version 1 : Attestation avec filiation
    file1 = generate_attestation(
        prenom_nom=prenom_nom,
        date_naissance=date_naissance,
        lieu_naissance=lieu_naissance,
        adresse=adresse,
        prenom_nom_pere=prenom_nom_pere,
        prenom_nom_mere=prenom_nom_mere,
        ville=ville,
        date_jour=date_jour,
        titre="ATTESTATION SUR L'HONNEUR DE NON-CONDAMNATION\nFAISANT APPARAÎTRE LA FILIATION",
        output_file="attestation_non_condamnation_filiation.pdf"
    )
    
    # Version 2 : Déclaration signée
    file2 = generate_attestation(
        prenom_nom=prenom_nom,
        date_naissance=date_naissance,
        lieu_naissance=lieu_naissance,
        adresse=adresse,
        prenom_nom_pere=prenom_nom_pere,
        prenom_nom_mere=prenom_nom_mere,
        ville=ville,
        date_jour=date_jour,
        titre="DÉCLARATION SUR L'HONNEUR DE NON-CONDAMNATION\nDATÉE ET SIGNÉE EN ORIGINAL",
        output_file="declaration_non_condamnation_signee.pdf"
    )
    
    # Version 3 : Attestation de filiation
    file3 = generate_attestation(
        prenom_nom=prenom_nom,
        date_naissance=date_naissance,
        lieu_naissance=lieu_naissance,
        adresse=adresse,
        prenom_nom_pere=prenom_nom_pere,
        prenom_nom_mere=prenom_nom_mere,
        ville=ville,
        date_jour=date_jour,
        titre="ATTESTATION DE FILIATION\n(NOM ET PRÉNOMS DES PARENTS)",
        output_file="attestation_filiation.pdf"
    )
    
    print(f"\n✅ 3 versions générées avec succès :")
    print(f"   1. {file1} - Pour 'Attestation... faisant apparaître la filiation'")
    print(f"   2. {file2} - Pour 'Déclaration... datée et signée'")
    print(f"   3. {file3} - Pour 'Attestation de filiation'")
    print(f"\n📄 Vous pouvez maintenant :")
    print(f"   1. Imprimer les 3 documents")
    print(f"   2. Les signer à la main")
    print(f"   3. Les scanner avec iPhone")
    print(f"   4. Uploader chaque version dans la section correspondante")
    
    return [file1, file2, file3]

if __name__ == "__main__":
    # Génération directe avec les informations de Yoann Marrale - 3 versions
    generate_all_versions(
        prenom_nom="Yoann Marrale",
        date_naissance="27/01/2001",
        lieu_naissance="Martigues",
        adresse="Traverse Louise Michel, Bâtiment C6, Appartement 1, 13500 Martigues",
        prenom_nom_pere="Bruno Marrale",
        prenom_nom_mere="Christelle Rohaut",
        ville="Martigues",
        date_jour=None  # Sera mis automatiquement à aujourd'hui
    )

