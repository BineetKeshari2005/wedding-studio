import { z } from 'zod';

const sectionEnum = z.enum(['Entry', 'Lounge', 'Dining', 'Bar', 'Stage', 'Photo Booth']);

export const createStudioProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required'),
    weddingPreferences: z.object({
      venue: z.string().optional(),
      budget: z.any().optional(),
      season: z.string().optional(),
      theme: z.string().optional(),
      eventFlow: z.string().optional(),
      timing: z.string().optional(),
      functions: z.array(z.string()).optional(),
      guestCount: z.any().optional(),
      colorPalette: z.array(z.string()).optional(),
    }).optional(),
  }),
});

export const updateStudioProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    status: z.enum(['draft', 'completed', 'archived']).optional(),
    weddingPreferences: z.record(z.string(), z.any()).optional(),
    selectedReferences: z.record(z.string(), z.any()).optional(),
    completedSections: z.array(sectionEnum).optional(),
    currentSection: sectionEnum.optional(),
  }),
});

export const saveSelectionSchema = z.object({
  body: z.object({
    projectId: z.string().uuid('Valid project ID is required'),
    section: sectionEnum,
    concepts: z.array(z.object({
      imageUrl: z.string().min(1, 'Image URL is required'),
      prompt: z.string().optional(),
      generationId: z.string().optional(),
      selectedFilters: z.record(z.string(), z.any()).optional(),
      referenceImagesUsed: z.any().optional(),
      isFavorite: z.boolean().optional(),
    })).min(1, 'At least one concept is required'),
  }),
});
