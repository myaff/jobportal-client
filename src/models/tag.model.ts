export interface TagDto {
  name: string;
  localizedName: string;
  tagCategory?: TagCategoryDto | null;
}

export interface TagCategoryDto {
  id: string;
  name: string;
}

export class TagCategory {
  id: string;
  name: string;

  constructor(data: TagCategoryDto) {
    this.id = data.id;
    this.name = data.name;
  }

  toString() {
    return this.name;
  }

  toJSON() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
    })
  }
}

export default class Tag {
  name: string;
  localizedName: string;
  category: TagCategory | null;

  constructor(data: TagDto) {
    this.name = data.name;
    this.localizedName = data.localizedName ?? this.name;
    this.category = data.tagCategory
      ? new TagCategory(data.tagCategory)
      : null;
  }

  toString() {
    return this.localizedName;
  }

  toJSON() {
    return JSON.stringify({
      name: this.name,
      localizedName: this.localizedName,
      category: this.category,
    });
  }
}