import { StudioRepository } from '../repositories/studio.repository';

const VALID_SECTIONS = ['Entry', 'Lounge', 'Dining', 'Bar', 'Stage', 'Photo Booth'];
const VALID_STATUSES = ['draft', 'completed', 'archived'];

export class StudioService {
  private repo = new StudioRepository();

  // ── Project CRUD ──

  async createProject(userId: string, data: { name: string; weddingPreferences?: any }) {
    return this.repo.createProject({
      userId,
      name: data.name,
      status: 'draft',
      weddingPreferences: data.weddingPreferences ?? {},
      selectedReferences: {},
      completedSections: [],
      currentSection: 'Entry',
    });
  }

  async getProject(userId: string, projectId: string) {
    const project = await this.repo.findProjectById(projectId);
    if (!project) {
      throw { statusCode: 404, message: 'Studio project not found' };
    }
    if (project.userId !== userId) {
      throw { statusCode: 403, message: 'Forbidden' };
    }
    return project;
  }

  async getUserProjects(userId: string) {
    return this.repo.findProjectsByUserId(userId);
  }

  async updateProject(userId: string, projectId: string, data: {
    name?: string;
    status?: string;
    weddingPreferences?: any;
    selectedReferences?: any;
    completedSections?: string[];
    currentSection?: string;
  }) {
    // Verify ownership
    await this.getProject(userId, projectId);

    // Validate status if provided
    if (data.status && !VALID_STATUSES.includes(data.status)) {
      throw { statusCode: 400, message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` };
    }

    // Validate currentSection if provided
    if (data.currentSection && !VALID_SECTIONS.includes(data.currentSection)) {
      throw { statusCode: 400, message: `Invalid section. Must be one of: ${VALID_SECTIONS.join(', ')}` };
    }

    // Validate completedSections if provided
    if (data.completedSections) {
      const invalid = data.completedSections.filter((s) => !VALID_SECTIONS.includes(s));
      if (invalid.length > 0) {
        throw { statusCode: 400, message: `Invalid sections: ${invalid.join(', ')}` };
      }
    }

    return this.repo.updateProject(projectId, data);
  }

  async deleteProject(userId: string, projectId: string) {
    await this.getProject(userId, projectId); // ownership check
    return this.repo.deleteProject(projectId);
  }

  // ── Save Selection (concepts) ──

  async saveSelection(userId: string, data: {
    projectId: string;
    section: string;
    concepts: Array<{
      imageUrl: string;
      prompt?: string;
      generationId?: string;
      selectedFilters?: any;
      referenceImagesUsed?: any;
      isFavorite?: boolean;
    }>;
  }) {
    // Validate section
    if (!VALID_SECTIONS.includes(data.section)) {
      throw { statusCode: 400, message: `Invalid section. Must be one of: ${VALID_SECTIONS.join(', ')}` };
    }

    // Verify ownership
    await this.getProject(userId, data.projectId);

    // Clear previous concepts for this section, then insert fresh
    await this.repo.deleteConceptsByProjectAndSection(data.projectId, data.section);

    // Build reference images from previously completed sections
    const project = await this.repo.findProjectById(data.projectId);
    const completedSections = (project?.completedSections as string[]) || [];
    const priorConcepts = await this.repo.findConceptsByProject(data.projectId);
    const referenceImages = priorConcepts
      .filter((c) => completedSections.includes(c.section) && c.section !== data.section)
      .map((c) => ({ section: c.section, imageUrl: c.imageUrl }));

    const conceptInputs = data.concepts.map((c) => ({
      projectId: data.projectId,
      section: data.section,
      imageUrl: c.imageUrl,
      prompt: c.prompt ?? null,
      generationId: c.generationId ?? null,
      selectedFilters: c.selectedFilters ?? null,
      referenceImagesUsed: c.referenceImagesUsed ?? referenceImages,
      isFavorite: c.isFavorite ?? false,
    }));

    const saved = await this.repo.createManyConcepts(conceptInputs);
    return saved;
  }

  // ── Moodboard (grouped concepts) ──

  async getMoodboard(userId: string, projectId: string) {
    await this.getProject(userId, projectId); // ownership

    const concepts = await this.repo.findConceptsByProject(projectId);

    // Group by section, maintaining the canonical order
    const grouped: Record<string, typeof concepts> = {};
    for (const section of VALID_SECTIONS) {
      const sectionConcepts = concepts.filter((c) => c.section === section);
      if (sectionConcepts.length > 0) {
        grouped[section] = sectionConcepts;
      }
    }

    return grouped;
  }
}
