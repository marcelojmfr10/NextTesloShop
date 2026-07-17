export const generatePaginationNumbers = (
  currentPage: number,
  totalPages: number,
) => {
  // si el número total de páginas es 7 o menos, vamos a mostrar todas las páginas
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // si la página actual está entre las primeras 3 páginas, vamos a mostrar las primeras 3 luego ... y últimas 2
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // si la página actual está en las últimas 3 páginas, vamos a mostrar las primeras 2 luego ... y últimas 3
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // si la página actual está en otro lugar medio, vamos a mostrar la primer página luego ..., página actual y vecinos
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
