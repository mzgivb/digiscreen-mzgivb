<template>
	<div class="geodreieck-overlay" v-show="visible" :style="overlayStyle" :data-html2canvas-ignore="true">
		<img src="static/img/geodreieck.svg" alt="Geodreieck" draggable="false" :style="imgStyle" />

		<!-- Drag handle -->
		<div class="geodreieck-drag-handle" @mousedown.stop.prevent="startDrag" @touchstart.stop.prevent="startDrag">
			<i class="material-icons" style="font-size: 16px;">drag_indicator</i>
		</div>

		<!-- Rotation handle -->
		<div class="geodreieck-rotate" @mousedown.stop.prevent="startRotate" @touchstart.stop.prevent="startRotate" :style="rotateHandleStyle">
			<i class="material-icons" style="font-size: 18px; color: #666;">rotate_right</i>
		</div>

		<!-- Scale handle -->
		<div class="geodreieck-scale" @mousedown.stop.prevent="startScale" @touchstart.stop.prevent="startScale" :style="scaleHandleStyle">
			<i class="material-icons" style="font-size: 16px; color: #666;">open_in_full</i>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Geodreieck',
	props: {
		visible: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			// The SVG viewBox is 160x80, aspect ratio 2:1
			baseWidth: 640,
			baseHeight: 320,
			posX: 200,
			posY: 200,
			rotation: 0,
			scale: 1,
			dragging: false,
			rotating: false,
			scaling: false,
			dragStart: { x: 0, y: 0 },
			rotateStart: 0,
			scaleStart: 0,
			scaleDistStart: 0
		}
	},
	computed: {
		currentWidth () {
			return this.baseWidth * this.scale
		},
		currentHeight () {
			return this.baseHeight * this.scale
		},
		overlayStyle () {
			return {
				position: 'fixed',
				left: this.posX + 'px',
				top: this.posY + 'px',
				width: this.currentWidth + 'px',
				height: this.currentHeight + 'px',
				transform: 'rotate(' + this.rotation + 'deg)',
				transformOrigin: (this.currentWidth / 2) + 'px ' + this.currentHeight + 'px',
				zIndex: 10002,
				pointerEvents: 'none',
				userSelect: 'none',
				touchAction: 'none'
			}
		},
		imgStyle () {
			return {
				width: '100%',
				height: '100%',
				pointerEvents: 'none',
				userSelect: 'none'
			}
		},
		rotateHandleStyle () {
			return {
				position: 'absolute',
				left: (this.currentWidth / 2 - 14) + 'px',
				top: '-28px',
				cursor: 'grab',
				background: 'rgba(255,255,255,0.8)',
				borderRadius: '50%',
				width: '28px',
				height: '28px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
			}
		},
		scaleHandleStyle () {
			return {
				position: 'absolute',
				right: '-14px',
				bottom: '-14px',
				cursor: 'nwse-resize',
				background: 'rgba(255,255,255,0.8)',
				borderRadius: '50%',
				width: '28px',
				height: '28px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
			}
		}
	},
	watch: {
		visible (val) {
			if (val) {
				this.emitGeometry()
			} else {
				this.$emit('update:geometry', null)
			}
		}
	},
	mounted () {
		if (this.visible) {
			this.emitGeometry()
		}
	},
	methods: {
		emitGeometry () {
			this.$emit('update:geometry', {
				posX: this.posX,
				posY: this.posY,
				rotation: this.rotation,
				scale: this.scale,
				baseWidth: this.baseWidth,
				baseHeight: this.baseHeight
			})
		},
		getEventPos (event) {
			if (event.touches && event.touches.length > 0) {
				return { x: event.touches[0].clientX, y: event.touches[0].clientY }
			}
			return { x: event.clientX, y: event.clientY }
		},
		startDrag (event) {
			const pos = this.getEventPos(event)
			this.dragging = true
			this.dragStart = { x: pos.x - this.posX, y: pos.y - this.posY }
			document.addEventListener('mousemove', this.onDrag)
			document.addEventListener('mouseup', this.stopDrag)
			document.addEventListener('touchmove', this.onDrag, { passive: false })
			document.addEventListener('touchend', this.stopDrag)
		},
		onDrag (event) {
			if (!this.dragging) return
			if (event.cancelable) event.preventDefault()
			const pos = this.getEventPos(event)
			this.posX = pos.x - this.dragStart.x
			this.posY = pos.y - this.dragStart.y
			this.emitGeometry()
		},
		stopDrag () {
			this.dragging = false
			document.removeEventListener('mousemove', this.onDrag)
			document.removeEventListener('mouseup', this.stopDrag)
			document.removeEventListener('touchmove', this.onDrag)
			document.removeEventListener('touchend', this.stopDrag)
		},
		startRotate (event) {
			const pos = this.getEventPos(event)
			const centerX = this.posX + this.currentWidth / 2
			const centerY = this.posY + this.currentHeight
			this.rotateStart = Math.atan2(pos.y - centerY, pos.x - centerX) * 180 / Math.PI - this.rotation
			this.rotating = true
			document.addEventListener('mousemove', this.onRotate)
			document.addEventListener('mouseup', this.stopRotate)
			document.addEventListener('touchmove', this.onRotate, { passive: false })
			document.addEventListener('touchend', this.stopRotate)
		},
		onRotate (event) {
			if (!this.rotating) return
			if (event.cancelable) event.preventDefault()
			const pos = this.getEventPos(event)
			const centerX = this.posX + this.currentWidth / 2
			const centerY = this.posY + this.currentHeight
			const angle = Math.atan2(pos.y - centerY, pos.x - centerX) * 180 / Math.PI
			this.rotation = angle - this.rotateStart
			this.emitGeometry()
		},
		stopRotate () {
			this.rotating = false
			document.removeEventListener('mousemove', this.onRotate)
			document.removeEventListener('mouseup', this.stopRotate)
			document.removeEventListener('touchmove', this.onRotate)
			document.removeEventListener('touchend', this.stopRotate)
		},
		startScale (event) {
			const pos = this.getEventPos(event)
			const centerX = this.posX + this.currentWidth / 2
			const centerY = this.posY + this.currentHeight
			this.scaleDistStart = Math.hypot(pos.x - centerX, pos.y - centerY)
			this.scaleStart = this.scale
			this.scaling = true
			document.addEventListener('mousemove', this.onScale)
			document.addEventListener('mouseup', this.stopScale)
			document.addEventListener('touchmove', this.onScale, { passive: false })
			document.addEventListener('touchend', this.stopScale)
		},
		onScale (event) {
			if (!this.scaling) return
			if (event.cancelable) event.preventDefault()
			const pos = this.getEventPos(event)
			const centerX = this.posX + this.baseWidth * this.scaleStart / 2
			const centerY = this.posY + this.baseHeight * this.scaleStart
			const dist = Math.hypot(pos.x - centerX, pos.y - centerY)
			const newScale = this.scaleStart * (dist / this.scaleDistStart)
			this.scale = Math.max(0.4, Math.min(3, newScale))
			this.emitGeometry()
		},
		stopScale () {
			this.scaling = false
			document.removeEventListener('mousemove', this.onScale)
			document.removeEventListener('mouseup', this.stopScale)
			document.removeEventListener('touchmove', this.onScale)
			document.removeEventListener('touchend', this.stopScale)
		}
	}
}
</script>

<style>
.geodreieck-overlay {
	position: fixed;
	pointer-events: none;
}

.geodreieck-drag-handle,
.geodreieck-rotate,
.geodreieck-scale {
	pointer-events: auto;
}

.geodreieck-drag-handle {
	position: absolute;
	left: 8px;
	top: 8px;
	cursor: grab;
	background: rgba(255,255,255,0.8);
	border-radius: 50%;
	width: 28px;
	height: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

.geodreieck-drag-handle:hover,
.geodreieck-rotate:hover,
.geodreieck-scale:hover {
	background: rgba(255, 255, 255, 1) !important;
}
</style>
