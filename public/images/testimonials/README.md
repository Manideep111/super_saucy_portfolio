# Testimonial screenshots

The Testimonials section is a carousel — drop your screenshots in
this folder using the filenames listed below. They cycle every 5
seconds (paused on hover/focus) and the user can step through them
with the left/right arrows or the dots underneath.

## Expected files

- `testimonial-1.png`
- `testimonial-2.png`
- `testimonial-3.png`
- `testimonial-4.png`

## Notes

- **Any aspect ratio is fine.** Each image is rendered with
  `object-contain`, so a tall WhatsApp screenshot, a wide Slack
  thread, and an Upwork review card all display without being
  cropped. The carousel stage has a fixed height; whitespace fills
  the rest.
- **PNG or JPG both work.** If you want to use `.jpg`, just update
  the `src` paths in the `TESTIMONIAL_IMAGES` array inside
  `src/components/sections/Testimonials.tsx`.
- **To add or remove slides**, edit the same array. The dot indicator
  and the auto-advance loop wrap on whatever length you give them.
