#!/usr/bin/env python3
"""
Script pour combiner deux images dans un PDF
Usage: python combine_images_to_pdf.py image1.jpg image2.jpg [output.pdf] [--side-by-side]

Options:
  --side-by-side : Place les deux images côte à côte sur une même page (par défaut: une image par page)

Exemples:
  # Carte d'identité : recto page 1, verso page 2
  python combine_images_to_pdf.py recto.jpg verso.jpg carte_identite.pdf
  
  # Deux images côte à côte sur une page
  python combine_images_to_pdf.py image1.jpg image2.jpg output.pdf --side-by-side
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
from PIL import Image
import sys
import os

def combine_images_to_pdf(image1_path: str, image2_path: str, output_path: str = "combined_images.pdf", side_by_side: bool = False):
    """
    Combine deux images dans un PDF
    
    Args:
        image1_path: Chemin vers la première image
        image2_path: Chemin vers la deuxième image
        output_path: Chemin du PDF de sortie
        side_by_side: Si True, place les deux images côte à côte sur une page. Sinon, une image par page.
    """
    # Vérifier que les fichiers existent
    if not os.path.exists(image1_path):
        print(f"❌ Erreur: Le fichier '{image1_path}' n'existe pas")
        return False
    
    if not os.path.exists(image2_path):
        print(f"❌ Erreur: Le fichier '{image2_path}' n'existe pas")
        return False
    
    try:
        # Ouvrir les images pour obtenir leurs dimensions
        img1 = Image.open(image1_path)
        img2 = Image.open(image2_path)
        
        # Créer le PDF
        c = canvas.Canvas(output_path, pagesize=A4)
        width, height = A4
        
        # Page 1 : Première image
        # Calculer les dimensions pour centrer l'image sur la page A4
        img1_width, img1_height = img1.size
        img1_ratio = img1_width / img1_height
        
        # Ajuster l'image à la page A4 en gardant les proportions
        page_width = width - 2*cm  # Marges de 1cm de chaque côté
        page_height = height - 2*cm
        
        if img1_ratio > (page_width / page_height):
            # Image plus large que haute -> ajuster à la largeur
            draw_width = page_width
            draw_height = page_width / img1_ratio
        else:
            # Image plus haute que large -> ajuster à la hauteur
            draw_height = page_height
            draw_width = page_height * img1_ratio
        
        # Centrer l'image
        x = (width - draw_width) / 2
        y = (height - draw_height) / 2
        
        if side_by_side:
            # Mode côte à côte : les deux images sur une même page
            # Calculer les dimensions pour les deux images côte à côte
            available_width = width - 3*cm  # Marges gauche/droite + espace entre images
            available_height = height - 2*cm  # Marges haut/bas
            
            # Chaque image prend la moitié de la largeur disponible
            img_width = (available_width - 0.5*cm) / 2  # Moitié moins un petit espace entre les deux
            
            # Ajuster la hauteur pour chaque image en gardant les proportions
            img1_draw_height = img_width / img1_ratio
            img2_draw_height = img_width / img2_ratio
            
            # Prendre la hauteur maximale et ajuster si nécessaire
            max_height = min(img1_draw_height, img2_draw_height, available_height)
            if max_height > available_height:
                max_height = available_height
                img_width = max_height * min(img1_ratio, img2_ratio)
            
            # Positionner la première image à gauche
            x1 = 1.5*cm
            y1 = (height - max_height) / 2
            
            # Positionner la deuxième image à droite
            x2 = width - 1.5*cm - img_width
            y2 = (height - max_height) / 2
            
            # Dessiner les deux images
            c.drawImage(image1_path, x1, y1, width=img_width, height=max_height, preserveAspectRatio=True)
            c.drawImage(image2_path, x2, y2, width=img_width, height=max_height, preserveAspectRatio=True)
            c.showPage()
            
            print(f"✅ PDF créé avec succès : {output_path}")
            print(f"   - Page unique : {image1_path} ({img1_width}x{img1_height}) | {image2_path} ({img2_width}x{img2_height})")
        else:
            # Mode une image par page (par défaut)
            c.drawImage(image1_path, x, y, width=draw_width, height=draw_height, preserveAspectRatio=True)
            c.showPage()
            
            # Page 2 : Deuxième image
            img2_width, img2_height = img2.size
            img2_ratio = img2_width / img2_height
            
            if img2_ratio > (page_width / page_height):
                draw_width = page_width
                draw_height = page_width / img2_ratio
            else:
                draw_height = page_height
                draw_width = page_height * img2_ratio
            
            x = (width - draw_width) / 2
            y = (height - draw_height) / 2
            
            c.drawImage(image2_path, x, y, width=draw_width, height=draw_height, preserveAspectRatio=True)
            c.showPage()
            
            print(f"✅ PDF créé avec succès : {output_path}")
            print(f"   - Page 1 : {image1_path} ({img1_width}x{img1_height})")
            print(f"   - Page 2 : {image2_path} ({img2_width}x{img2_height})")
        
        # Sauvegarder le PDF
        c.save()
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de la création du PDF : {e}")
        return False

def main():
    """Point d'entrée principal"""
    if len(sys.argv) < 3:
        print("Usage: python combine_images_to_pdf.py <image1> <image2> [output.pdf] [--side-by-side]")
        print("\nExemples:")
        print("  # Carte d'identité : recto page 1, verso page 2")
        print("  python combine_images_to_pdf.py recto.jpg verso.jpg carte_identite.pdf")
        print("\n  # Deux images côte à côte sur une page")
        print("  python combine_images_to_pdf.py image1.jpg image2.jpg output.pdf --side-by-side")
        sys.exit(1)
    
    image1 = sys.argv[1]
    image2 = sys.argv[2]
    
    # Vérifier les options
    side_by_side = "--side-by-side" in sys.argv
    
    # Extraire le nom du fichier de sortie (si présent et pas une option)
    output = "combined_images.pdf"
    for arg in sys.argv[3:]:
        if not arg.startswith("--"):
            output = arg
            break
    
    combine_images_to_pdf(image1, image2, output, side_by_side)

if __name__ == "__main__":
    main()
