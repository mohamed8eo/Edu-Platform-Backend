import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { AddCategorieDto } from './dto/addCategorie.dto';
import { UpdateCategorieDto } from './dto/updateCategorie.dto';
import type { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Category')
@Controller('categorie')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}
  /*
  categorie/add post
  categorie/update/:slug update
  categorie/delete/:slug Delete
  categorie/:slug Get
  categorie/tree Get
  categorie Get all Parent Categories
 */
  @Post()
  @ApiOperation({ summary: 'Add a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully.' })
  async addCategorie(
    @Body() addCategorie: AddCategorieDto,
    @Req() req: Request,
  ) {
    return await this.categorieService.addCategorie(addCategorie, req);
  }

  @Patch('update/:slug')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully.' })
  async updateCategorie(
    @Param('slug') slug: string,
    @Body() updateCategorie: UpdateCategorieDto,
    @Req() req: Request,
  ) {
    return await this.categorieService.updateCategorie(
      slug,
      updateCategorie,
      req,
    );
  }

  @Delete('delete/:slug')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully.' })
  async deleteCategorie(@Param('slug') slug: string, @Req() req: Request) {
    return await this.categorieService.deleteCategorie(slug, req);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get category tree' })
  @ApiResponse({ status: 200, description: 'Category tree retrieved.' })
  getTree() {
    return this.categorieService.getTree();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiResponse({ status: 200, description: 'Category retrieved.' })
  async getCategorie(@Param('slug') slug: string) {
    return await this.categorieService.getCategorie(slug);
  }

  @Get(':slug/children')
  @ApiOperation({ summary: 'Get children of a parent category' })
  @ApiResponse({ status: 200, description: 'Children retrieved.' })
  async getParentChildren(@Param('slug') slug: string) {
    return await this.categorieService.getParentChildren(slug);
  }

  @Get()
  @ApiOperation({ summary: 'Get all parent categories' })
  @ApiResponse({ status: 200, description: 'Parent categories retrieved.' })
  async getAllParentCategories() {
    return await this.categorieService.getAllParentCategories();
  }

  @Get(':slug/courses')
  @ApiOperation({ summary: 'Get courses by category slug' })
  @ApiResponse({ status: 200, description: 'Courses retrieved.' })
  getCourses(@Param('slug') slug: string) {
    return this.categorieService.getCoursesByCategorySlug(slug);
  }
}
