export interface TagDto {
  name: string;
  localizedName: string;
  tagCategory?: TagCategoryDto | null;
}

export interface TagCategoryDto {
  id: string;
  name: string;
}