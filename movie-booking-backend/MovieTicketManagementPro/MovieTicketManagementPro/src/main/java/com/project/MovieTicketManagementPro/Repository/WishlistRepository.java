package com.project.MovieTicketManagementPro.Repository;

import com.project.MovieTicketManagementPro.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist,Long> {

    List<Wishlist> findByUserIdOrderByAddedAtDesc(Long userId);

    boolean existsByUserIdAndMovieId(Long userId, Long movieId);

    void deleteByUserIdAndMovieId(Long userId, Long movieId);

    Long countByMovieId(Long movieId);

}
