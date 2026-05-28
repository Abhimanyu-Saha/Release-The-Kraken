import { onMounted, type Ref } from 'vue'

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function animateScroll(el: HTMLElement, from: number, to: number, duration: number): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now()
    function step(now: number) {
      const t = Math.min((now - start) / duration, 1)
      el.scrollTop = from + (to - from) * easeInOut(t)
      if (t < 1) requestAnimationFrame(step)
      else resolve()
    }
    requestAnimationFrame(step)
  })
}

export function useScrollHint(el: Ref<HTMLElement | null>) {
  onMounted(() => {
    setTimeout(async () => {
      const target = el.value
      if (!target || target.scrollHeight <= target.clientHeight) return

      await animateScroll(target, 0, 100, 300)
    }, 300)
  })
}
