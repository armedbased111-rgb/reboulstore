"""
Tests pour la génération de code
"""

import unittest
import tempfile
import shutil
from pathlib import Path
import sys

# Ajouter le dossier parent au path
sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.code_generator import (
    EntityGenerator,
    DTOGenerator,
    ServiceGenerator,
    ControllerGenerator,
    ModuleGenerator,
)

class TestEntityGenerator(unittest.TestCase):
    """Tests pour EntityGenerator"""
    
    def setUp(self):
        self.generator = EntityGenerator()
    
    def test_generate_basic_entity(self):
        """Test génération d'une entité basique"""
        fields = [
            {
                'name': 'name',
                'type': 'string',
                'ts_type': 'string',
                'length': 255,
                'nullable': False,
                'unique': False,
            },
            {
                'name': 'description',
                'type': 'text',
                'ts_type': 'string | null',
                'length': None,
                'nullable': True,
                'unique': False,
            },
        ]
        
        code = self.generator.generate('Review', fields)
        
        # Vérifications
        self.assertIn('export class Review', code)
        self.assertIn('@Entity(\'reviews\')', code)
        self.assertIn('@PrimaryGeneratedColumn(\'uuid\')', code)
        self.assertIn('name: string', code)
        self.assertIn('description: string | null', code)
        self.assertIn('@CreateDateColumn()', code)
        self.assertIn('@UpdateDateColumn()', code)
    
    def test_generate_entity_with_relations(self):
        """Test génération d'une entité avec relations"""
        fields = [
            {
                'name': 'name',
                'type': 'string',
                'ts_type': 'string',
                'length': 255,
                'nullable': False,
                'unique': False,
            },
        ]
        
        relations = [
            {
                'type': 'ManyToOne',
                'name': 'product',
                'target': 'Product',
                'target_lower': 'product',
                'foreign_key': 'productId',
                'nullable': False,
            },
        ]
        
        code = self.generator.generate('Review', fields, relations)
        
        # Vérifications
        self.assertIn('@ManyToOne', code)
        self.assertIn('product: Product', code)
        self.assertIn('@JoinColumn', code)

class TestDTOGenerator(unittest.TestCase):
    """Tests pour DTOGenerator"""
    
    def setUp(self):
        self.generator = DTOGenerator()
    
    def test_generate_create_dto(self):
        """Test génération d'un CreateDto"""
        fields = [
            {
                'name': 'name',
                'type': 'string',
                'ts_type': 'string',
                'length': 255,
                'nullable': False,
            },
            {
                'name': 'description',
                'type': 'text',
                'ts_type': 'string | null',
                'length': None,
                'nullable': True,
            },
        ]
        
        code = self.generator.generate_create('Review', fields)
        
        # Vérifications
        self.assertIn('export class CreateReviewDto', code)
        self.assertIn('@IsString()', code)
        self.assertIn('@IsNotEmpty()', code)
        self.assertIn('@IsOptional()', code)
        self.assertIn('name: string', code)
        self.assertIn('description: string | null', code)
    
    def test_generate_update_dto(self):
        """Test génération d'un UpdateDto"""
        code = self.generator.generate_update('Review')
        
        # Vérifications
        self.assertIn('export class UpdateReviewDto', code)
        self.assertIn('PartialType', code)
        self.assertIn('CreateReviewDto', code)

class TestServiceGenerator(unittest.TestCase):
    """Tests pour ServiceGenerator"""
    
    def setUp(self):
        self.generator = ServiceGenerator()
    
    def test_generate_service(self):
        """Test génération d'un service"""
        code = self.generator.generate('Review')
        
        # Vérifications
        self.assertIn('export class ReviewService', code)
        self.assertIn('@Injectable()', code)
        self.assertIn('@InjectRepository(Review)', code)
        self.assertIn('findAll(', code)  # Signature avec options
        self.assertIn('findOne(id: string)', code)
        self.assertIn('create(', code)
        self.assertIn('update(', code)
        self.assertIn('remove(', code)
        self.assertIn('NotFoundException', code)
        self.assertIn('pagination', code.lower())  # Vérifier pagination

class TestControllerGenerator(unittest.TestCase):
    """Tests pour ControllerGenerator"""
    
    def setUp(self):
        self.generator = ControllerGenerator()
    
    def test_generate_controller(self):
        """Test génération d'un controller"""
        code = self.generator.generate('Review')
        
        # Vérifications
        self.assertIn('export class ReviewController', code)
        self.assertIn('@Controller(\'reviews\')', code)
        self.assertIn('@Get()', code)
        self.assertIn('@Post()', code)
        self.assertIn('@Patch(\':id\')', code)
        self.assertIn('@Delete(\':id\')', code)
        self.assertIn('@HttpCode(HttpStatus.CREATED)', code)
        self.assertIn('@HttpCode(HttpStatus.NO_CONTENT)', code)

class TestModuleGenerator(unittest.TestCase):
    """Tests pour ModuleGenerator"""
    
    def setUp(self):
        self.generator = ModuleGenerator()
    
    def test_generate_module(self):
        """Test génération d'un module"""
        code = self.generator.generate('Review')
        
        # Vérifications
        self.assertIn('export class ReviewModule', code)
        self.assertIn('@Module({', code)
        self.assertIn('TypeOrmModule.forFeature([Review])', code)
        self.assertIn('ReviewController', code)
        self.assertIn('ReviewService', code)

if __name__ == '__main__':
    unittest.main()

