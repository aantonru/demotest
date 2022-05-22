export const glib: Record<string, string | string[][]> = {
	simplex3: `
    vec4 permute4(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

    float simplex3(vec3 v){
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1. + 3.0 * C.xxx;

      i = mod(i, 289.0 );
      vec4 p = permute4( permute4( permute4(
          i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

      float n_ = 1.0/7.0; // N=7
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                    dot(p2,x2), dot(p3,x3) ) );
    }

    float fbm3(vec3 x) {
      float v = 0.0;
      float a = 0.5;
      vec3 shift = vec3(100);
      for (int i = 0; i < 2; ++i) {
        v += a * simplex3(x);
        x = x * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }
    `,
	simplex2: `
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float simplex2(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    float fbm2(vec2 x) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100);
      // Rotate to reduce axial bias
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
      for (int i = 0; i < 5; ++i) {
        v += a * simplex2(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }
    `,
	dot2: `
    float rand2D(in vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }
    float dotNoise2D(in float x, in float y, in float fractionalMaxDotSize, in float dDensity)
    {
      float integer_x = x - fract(x);
      float fractional_x = x - integer_x;
      float integer_y = y - fract(y);
      float fractional_y = y - integer_y;
      if (rand2D(vec2(integer_x+1.0, integer_y +1.0)) > dDensity) {return 0.0;}

      float xoffset = (rand2D(vec2(integer_x, integer_y)) -0.5);
      float yoffset = (rand2D(vec2(integer_x+1.0, integer_y)) - 0.5);
      float dotSize = 0.5 * fractionalMaxDotSize * max(0.25,rand2D(vec2(integer_x, integer_y+1.0)));

      vec2 truePos = vec2 (0.5 + xoffset * (1.0 - 2.0 * dotSize) , 0.5 + yoffset * (1.0 -2.0 * dotSize));
      float distance = length(truePos - vec2(fractional_x, fractional_y));
      return 1.0 - smoothstep (0.3 * dotSize, 1.0* dotSize, distance);
    }
    float dot2(in vec2 coord, in float wavelength, in float fractionalMaxDotSize, in float dDensity)
    {
      return dotNoise2D(coord.x/wavelength, coord.y/wavelength, fractionalMaxDotSize, dDensity);
    }`,
	mise3: `
    float mise3(vec3 co) {
      float m2pi=3.141592653*2.0;
      return sin(fract(sin(dot(co.xyz ,vec3(12.9898,78.233, 9441.8953))) * 43758.5453)*m2pi)*0.5+0.5;
    }`,
	mise2: `
    float mise2(vec2 co){
      return (fract(sin(dot(co.xy ,vec2(12.9898,78.233)))) * 43758.5453);
    }`,
	rawdirt3: `
        float rawhash( in vec3 p ) {
            return fract(sin(p.x*15.32+p.y*35.78+p.z*67.22) * 43758.23);
        }
        vec3 rawhash3(vec3 p) {
            return vec3(mininoise3(p*.754),mininoise3(1.5743*p.yxz+4.5891),mininoise3(p.xyz*78.233))-.5;
        }
        vec3 add = vec3(1.0, 0.0, 0.5);
        vec3 rawnoise3(vec3 x) {
            vec3 p = floor(x);
            vec3 f = fract(x);
            f = f*f*(3.7-2.3*f);
            return rawhash3(floor(fract(x)+fract(p*0.1))*0.1);
            //return mix( mix( rawhash3(p), rawhash3(p + add.zxy),3.0*p.z), mix( rawhash3(p), rawhash3(p + add.xyz),3.0*p.y), 3.0*p.x);
        }
        vec3 rawfbm3(vec3 x) {
            vec3 r = x;
            float a = 1.;
            for (int i = 0; i < 9; i++) {
                r += rawnoise3(r*a)/a;
                //a*=1.47;
            }
            return (r-x)*1.5;
        }
        vec3 rawdirt3(vec3 pos){
            float n1 = simplex3(pos.xyz*0.8);
            vec3 p12 = rawfbm3(pos.xyz*0.3);
            float c0 = length(p12);
            float c1 = p12.y;
            float c2 = min(c1,1.0);
            float c9 = abs(c2);//*abs(n1)*2.0;
            return vec3(c9-0.1, c9-0.05, c9)*0.7;
        }
    `,
	smoo: `
    float smoo(float x, vec4 cps){
        float result=abs(smoothstep(cps.x, cps.y, x)-smoothstep(cps.z, cps.w, x));
        return result;
    }
    `,
	worldpos: [
		[
			'#define STANDARD',
			`#define STANDARD
                  varying vec4 worldPosition;`,
		],
		[
			'#include <worldpos_vertex>',
			`worldPosition = vec4( transformed, 1.0 );
                  #ifdef USE_INSTANCING
                  worldPosition = instanceMatrix * worldPosition;
                  #endif
                  worldPosition = modelMatrix * worldPosition;`,
		],
	],
};

export const basix3 = {
	frag: `uniform vec3 diffuse;
uniform float opacity;
uniform float time;
varying vec2 vuv;
varying vec4 worldPosition;
#ifndef FLAT_SHADED

  varying vec3 vNormal;

#endif

#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>

	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

	// accumulation (baked indirect lighting only)
	#ifdef USE_LIGHTMAP

		vec4 lightMapTexel= texture2D( lightMap, vUv2 );
		reflectedLight.indirectDiffuse += lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;

	#else

		reflectedLight.indirectDiffuse += vec3( 1.0 );

	#endif

	// modulation
	#include <aomap_fragment>

	reflectedLight.indirectDiffuse *= diffuseColor.rgb;

	vec3 outgoingLight = reflectedLight.indirectDiffuse;

	#include <envmap_fragment>

	gl_FragColor = vec4( outgoingLight, diffuseColor.a );

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`,
	vert: `
uniform float time;
varying vec2 vuv;
varying vec4 worldPosition;
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <skinbase_vertex>

	#ifdef USE_ENVMAP

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>

	#endif

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
  worldPosition = vec4( position, 1.0 );
  worldPosition = modelMatrix * worldPosition;
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>

}
`,
};

export const smoke = {
	fragment: `
  uniform float time;
  varying vec4 worldPosition;
  varying vec2 vUv;
  ${glib.smoo}
float rand(vec2 n) {
  //This is just a compounded expression to simulate a random number based on a seed given as n
  	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
  //Uses the rand function to generate noise
	  const vec2 d = vec2(0.0, 1.0);
	  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	  return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {
  //fbm stands for "Fractal Brownian Motion" https://en.wikipedia.org/wiki/Fractional_Brownian_motion
	  float total = 0.0, amplitude = 1.0;
	  for (int i = 0; i < 4; i++) {
 	   total += noise(n) * amplitude;
	    n += n;
	    amplitude *= 0.5;
	  }
	  return total;
}

  void main() {
    vec2 resolution=vec2(1.0,10.0);
    vec2 cuv=vec2(vUv.x-0.5, vUv.y-0.5);
    float dist=sqrt(pow(cuv.x,2.0)+pow(cuv.y,2.0));
    if (dist<0.05) discard;
    vec2 speed=vec2(0.0,-0.9);
    float phi=atan(cuv.x, cuv.y);
//    vec2 fpos=worldPosition.xz;
    vec2 fpos=vec2(phi, 1.0-dist);
    float alpha=0.5;
    float shift=0.8;
    //This is where our shader comes together
    const vec3 c1 = vec3(126.0/255.0, 0.0/255.0, 97.0/255.0);
    const vec3 c2 = vec3(173.0/255.0, 0.0/255.0, 161.4/255.0);
    const vec3 c3 = vec3(0.2, 0.0, 0.0);
    const vec3 c4 = vec3(164.0/255.0, 1.0/255.0, 214.4/255.0);
    const vec3 c5 = vec3(0.1);
    const vec3 c6 = vec3(0.9);

    //This is how "packed" the smoke is in our area. Try changing 8.0 to 1.0, or something else
    vec2 p = fpos.xy * 18.0 / resolution.xx;
    //The fbm function takes p as its seed (so each pixel looks different) and time (so it shifts over time)
    float q = fbm(p - time * 0.1);
    vec2 r = vec2(fbm(p + q + time * speed.x - p.x - p.y), fbm(p + q - time * speed.y));
    vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
    float grad = fpos.y / resolution.y;
    vec3 pre=vec3(c * cos(1.0 * fpos.y / resolution.y)*0.7);
    float dy=smoo(dist, vec4(0.0,0.05,0.1,0.4));
    float ap=dy*(pre.x+pre.z)/2.0;
    if (ap<0.1) discard;
    gl_FragColor = vec4(pre, ap);
    gl_FragColor.xyz *= 1.0-grad;
//    gl_FragColor=vec4(0.5,0.5,0.1,1.0);
}`,
	vertex: `
    uniform float time;
    varying vec4 worldPosition;
    varying vec2 vUv;
void main () {
    worldPosition = vec4( position, 1.0 );
    worldPosition = modelMatrix * worldPosition;
    vUv=uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
};

export const smokelaser = {
	fragment: `
      uniform float time;
      uniform float maxz;
      uniform vec3 tint;
      varying vec2 vUv;
      varying vec4 worldPosition;
      ${glib.dot2}
      ${glib.simplex3}
      ${glib.smoo}
      void main() {
          if (vUv.y>maxz) discard;
          float m2pi=3.141592653*2.0;
          vec2 uvt=vec2(vUv.x, vUv.y+time);
          float dt=dot2(uvt, 0.00001, 0.9,1.0);
          vec3 wpt=vec3(worldPosition.x+sin(time)*0.2, worldPosition.y+sin(time+m2pi/2.0)*0.2, worldPosition.z+cos(time)*0.2);
          float sd=fbm3(wpt);
          float srt=0.0007;
          float ay=smoo(vUv.y, vec4(0.0001, 0.0002, 0.0002, srt));
          float mz=smoo(vUv.y, vec4(maxz-srt, maxz-srt/2.0, maxz, maxz+srt/100.0));
          float aph=ay+mz+ay/2.0+sd*0.5;
          if (aph<0.001) discard;

          float aph2=aph;
          vec3 color9=tint;
      gl_FragColor = vec4(color9, aph2);
      }`,
	vertex: `
      uniform float time;
      uniform float maxz;
      uniform vec3 tint;
      varying vec2 vUv;
      varying vec4 worldPosition;
      void main () {
      vUv=uv;
      worldPosition = vec4( position, 1.0 );
      worldPosition = modelMatrix * worldPosition;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
};

export const solidlaser = {
	fragment: `
      varying vec2 vUv;
      void main() {
        float alp=vUv.x;
        float bet=1.0-pow(vUv.y,2.0);
        vec3 clr=vec3(1.0, 1.0, 1.0);
        gl_FragColor = vec4(clr, bet);
      }`,
	vertex: `
      varying vec2 vUv;
      void main () {
      vUv=uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
};

export const fragfur = `
uniform vec3 color1;
uniform float offset;
varying vec3 vNormal;
varying vec2 vUv;
uniform float globalTime;
${glib.smoo}

float mird(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 hueshift(vec3 color, float hue)
{
hue=hue*3.14159265359;
const vec3 k = vec3(0.57735, 0.57735, 0.57735);
float cosAngle = cos(hue);
return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
}

void main() {
    float m2pi=3.141592653*0.01;
    float dpm=1.0;
    float dpix=(2240.0*1.0)*dpm;
    float dpiy=(540.0*1.0)*dpm;
    vec2 uv2=vec2(vUv.x+sin(vUv.y*m2pi*24.0)*0.3, vUv.y);
    float cx=(uv2.x*dpix-fract(uv2.x*dpix))/dpix;
    float cy=(uv2.y*dpiy-fract(uv2.y*dpiy))/dpiy;
    vec2 uvs=vec2(cx, cy);
    vec2 uvs2=vec2(cy, cx);
    float gre=mird(uvs);
    float blu=gre*1.3;
    float red=gre;
    float alp=1.0;
    vec4 col = vec4(1.0, 1.0, 1.0, 1.0);

    if ( offset>0.0 && gre < offset) {
        discard;
    }

    float shadow = mix(0.5,blu,offset);

    vec3 light = vec3(0.5,1.0,0.3);
    float d = max(0.15,dot(vNormal.xyz, light))*0.6;
    vec3 col2=color1*mird(uvs)*mird(uvs);
    gl_FragColor = vec4(col2*d*2.2*shadow, 1.05-offset);
}`;
export const vertexfur = `
uniform vec3 color1;
uniform float offset;
uniform float globalTime;
uniform vec3 gravity;
varying vec2 vUv;
varying vec3 vNormal;



void main() {
    float spacing = 0.15;
    vec3 displacement = vec3(0.0,0.0,0.0);
    vec3 forceDirection = vec3(0.0,0.0,0.0);
    // "wind"
    forceDirection.x = sin(globalTime*2.0+uv.x*2.05) * 0.6;
    forceDirection.y = cos(globalTime*2.09+uv.y*3.04) * 0.6;
    forceDirection.z = sin(globalTime*2.3+position.y*47.04) * 0.6;
    // "gravity"
    displacement = gravity + forceDirection;
    float displacementFactor = pow(offset, 3.0)*0.1;
    vec3 aNormal = normal;
    aNormal.xyz += displacement*displacementFactor;
    // move outwards depending on offset(layer) and normal+force+gravity
    vec3 animated = vec3( position.x, position.y, position.z )+(normalize(aNormal)*offset*spacing);
    vNormal = normalize(normal*aNormal);
    vUv = uv*1.0;
    vec4 mvPosition = modelViewMatrix * vec4( animated, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}`;
