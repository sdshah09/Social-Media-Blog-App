import React from "react";

const PostPagination = ({ page, setPage, postCount, pagesPerGroup, pageGroup, setPageGroup }) => {
  const totalPages = postCount ? Math.ceil(postCount.totalPosts / 3) : 1;

  const pagination = () => {
    const startPage = pageGroup * pagesPerGroup + 1;
    const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
    let pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${i === page ? "active" : ""}`}>
          <button className="page-link" onClick={() => setPage(i)}>
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };

  return (
    <ul className="pagination justify-content-center">
      <li className={`page-item ${pageGroup === 0 && "disabled"}`}>
        <button
          className="page-link"
          onClick={() => setPageGroup(pageGroup - 1)}
        >
          &laquo;
        </button>
      </li>
      {pagination()}
      <li className={`page-item ${(pageGroup + 1) * pagesPerGroup >= totalPages && "disabled"}`}>
        <button
          className="page-link"
          onClick={() => setPageGroup(pageGroup + 1)}
        >
          &raquo;
        </button>
      </li>
    </ul>
  );
};

export default PostPagination;
