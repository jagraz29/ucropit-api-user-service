export type TPagination = {
  currentPage: number
  totalPages: number
  limit: number
  offset: number
  total: number
  prevPage: boolean
  nextPage: boolean
}

interface IPagination {
  calculate(count: number): TPagination
}

class Pagination implements IPagination {
  page: number
  limit: number
  skip: number

  constructor(page: number, limit: number) {
    this.page = page
    this.limit = limit > 500 ? 500 : limit
    this.skip = this.calculateSkip()
  }

  calculate(count: number): TPagination {
    const currentPage = Math.ceil(this.skip / this.limit) + 1
    const totalPages = Math.ceil(count / this.limit)

    return {
      currentPage,
      totalPages,
      limit: this.limit,
      offset: this.skip,
      total: count,
      prevPage: currentPage > 1 ? true : false,
      nextPage: currentPage < totalPages ? true : false
    }
  }

  private calculateSkip(): number {
    return this.limit * (this.page === 0 ? this.page : this.page - 1)
  }
}
export default Pagination
