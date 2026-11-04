import { Heart, Sparkles } from "lucide-react";

/** Decorative, non-medical illustration. CSS animation respects reduced-motion preferences. */
const WombAnimation = ({ compact = false }: { compact?: boolean }) => (
  <div className={`womb-scene ${compact ? "womb-scene-compact" : ""}`} role="img" aria-label="Gentle animated illustration representing the womb and the beginning of life">
    <div className="womb-orbit orbit-one" />
    <div className="womb-orbit orbit-two" />
    <div className="womb-glow" />
    <svg className="womb-svg" viewBox="0 0 420 420" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="wombFill" x1="100" y1="80" x2="320" y2="340" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7B7C8"/><stop offset=".52" stopColor="#D99ACB"/><stop offset="1" stopColor="#9B80C8"/>
        </linearGradient>
        <linearGradient id="wombLine" x1="90" y1="110" x2="330" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF0F5"/><stop offset="1" stopColor="#B68BD6"/>
        </linearGradient>
        <radialGradient id="wombCore"><stop stopColor="#FFF5F8"/><stop offset=".55" stopColor="#F8C8D9"/><stop offset="1" stopColor="#D99ACB" stopOpacity=".25"/></radialGradient>
      </defs>
      <path d="M210 151 C185 128 157 113 127 126 C91 142 91 192 117 218 C139 240 164 237 179 216 C186 207 194 195 210 193 C226 195 234 207 241 216 C256 237 281 240 303 218 C329 192 329 142 293 126 C263 113 235 128 210 151Z" fill="url(#wombFill)" opacity=".96"/>
      <path d="M210 183 C193 204 184 223 186 250 C188 282 199 307 210 326 C221 307 232 282 234 250 C236 223 227 204 210 183Z" fill="url(#wombFill)"/>
      <path d="M128 132 C105 110 92 91 81 71 M292 132 C315 110 328 91 339 71" stroke="url(#wombLine)" strokeWidth="13" strokeLinecap="round"/>
      <path d="M81 71 C67 54 47 57 43 75 C39 93 58 106 76 96 M339 71 C353 54 373 57 377 75 C381 93 362 106 344 96" stroke="#E9AFCB" strokeWidth="9" strokeLinecap="round"/>
      <path d="M127 135 C148 161 174 169 210 169 C246 169 272 161 293 135" stroke="#FFF1F6" strokeOpacity=".9" strokeWidth="5" strokeLinecap="round"/>
      <ellipse cx="210" cy="224" rx="52" ry="61" fill="url(#wombCore)" opacity=".95"/>
      <path d="M210 202 C190 207 185 232 202 248 C214 260 231 252 235 238 C239 224 228 209 210 202Z" fill="#FFF8FA" opacity=".9"/>
      <path d="M208 217 C202 226 207 237 218 239" stroke="#D18BB5" strokeWidth="3" strokeLinecap="round"/>
      <path d="M182 277 C192 290 201 298 210 301 C219 298 228 290 238 277" stroke="#FFF0F5" strokeWidth="4" strokeLinecap="round" opacity=".85"/>
    </svg>
    <div className="womb-heart"><Heart fill="currentColor" /></div>
    <div className="womb-sparkle sparkle-a"><Sparkles /></div>
    <div className="womb-sparkle sparkle-b"><Sparkles /></div>
    <span className="womb-caption">A little more connected to your body</span>
  </div>
);

export default WombAnimation;
