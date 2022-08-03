const getCategoriesChildrenWithData = categories =>
  categories?.children_data.map(data => ({
    name: data.name,
    data: data.children_data,
    id: data.id,
    isActive: data.is_active,
  })) ?? [];

export { getCategoriesChildrenWithData };
