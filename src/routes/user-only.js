const router = require('express').Router()
const queries = require('../db/queries.js')

router.route('/albums/:albumId/reviews/new')
  .get((req, res) => {
    queries.getAlbumById(req.params.albumId)
      .then((album) => {
        res.render('new-review', {album})
      })
  })
  .post((req, res) => {
    const reviewContent = req.body.content
    const userId = res.locals.userId
    const albumId = req.params.albumId
    queries.createReview(reviewContent, userId, albumId)
      .then(res.redirect(`/albums/${albumId}`))
  })

router.route('/sign-out')
  .get((req, res) => {
    req.session.destroy((error) => {
      if (error) {
        console.error('Error destroying session')
        throw error
      } else res.redirect('/')
    })
  })

router.delete('/deletereview/:reviewId', (req) => {
  queries.getReviewById(req.params.reviewId)
    .then((review) => {
      if (review.user_id === req.session.user.user_id) {
        queries.deleteReviewById(req.params.reviewId)
      } else (console.error('Error deleting review'))
    })
})

module.exports = router
