/*
import { now3 } from '../../Now3';

export class Phy {
	ison: boolean;

	constructor() {
		this.ison = false;
		now3.pub('phy.ready', this);
	}
//
//	add(o: any) {}

	lab(o: {
		bounce: any;
		restitution: any;
		mass: number;
		pq: string | any[];
		scale: any;
		friction: any;
		linear: any;
		angular: any;
		rolling: any;
		scalarVelocity: number;
		linearVelocity: any;
		angularVelocity: any;
		linearFactor: any;
		angularFactor: any;
		ccdT: any;
		ccdR: any;
	}) {
		if (o === undefined) return;
		let _shapes = {
			ico: (shp: any[]) => {
				return new Ammo.btSphereShape(shp[0]);
			},
			box: (shp: number[]) => {
				let v = math.v3();
				v.set(shp[0] * 0.5, shp[1] * 0.5, shp[2] * 0.5);
				let shape0 = new Ammo.btBoxShape(v);
				math.freev3(v);
				return shape0;
			},
			cyl: (shp: any[]) => {
				let v = math.v3();
				v.set(shp[1], shp[2] * 0.5, shp[0]);
				let shape0 = new Ammo.btCylinderShape(v);
				math.freev3(v);
				return shape0;
			},
			con: (shp: any[]) => {
				return new Ammo.btConeShape(shp[0], shp[1]);
			},
		};
		if (o.bounce !== undefined) o.restitution = o.bounce;
		let getShape = (o: { [x: string]: any }) => {
			let key = Object.keys(o).find((k) => {
				return Object.keys(_shapes).some((sk) => {
					return sk === k && fun(_shapes[sk]);
				});
			});
			if (key === undefined || key === null) return _shapes['ico']([1]);
			else return _shapes[key](o[key]);
		};

		let _rotation = (o: { pq: any[] }) => {
			let q = new Ammo.btQuaternion(o.pq[3], o.pq[4], o.pq[5], o.pq[6]);
			return q;
		};
		let shape = getShape(o);
		const margin = 0.001;
		shape.setMargin(margin);
		let mass = o.mass * 1000;

		let localInertia = math.v3();
		localInertia.set(0, 0, 0);
		shape.calculateLocalInertia(mass, localInertia);
		let tr = math.tr();
		tr.identity();
		let v = math.v3();
		v.set(...o.pq.slice(0, 3));
		tr.setOrigin(v);
		let q = math.q();
		q.set(...o.pq.slice(3));
		tr.setRotation(q);
		let s = math.v3();
		if (false && o.scale !== undefined) {
			s.set(...o.scale);
			tr.setScale(s);
		}
		let motionState = new Ammo.btDefaultMotionState(tr);
		let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);

		if (o.friction !== undefined) rbInfo.set_m_friction(o.friction);
		if (o.restitution !== undefined) rbInfo.set_m_restitution(o.restitution);
		if (o.linear !== undefined) rbInfo.set_m_linearDamping(o.linear);
		if (o.angular !== undefined) rbInfo.set_m_angularDamping(o.angular);
		if (o.rolling !== undefined) rbInfo.set_m_rollingFriction(o.rolling);

		let b = new Ammo.btRigidBody(rbInfo);
		let p1 = math.v3();
		let p2 = math.v3();
		q = math.q();
		if (o.scalarVelocity !== undefined) {
			p2.fromArray([0, 0, -o.scalarVelocity]);
			q.fromArray(o.pq.slice(3));
			p2.direction(q);
			b.setLinearVelocity(p2);
		}
		if (o.linearVelocity !== undefined) b.setLinearVelocity(p1.fromArray(o.linearVelocity, 0));
		if (o.angularVelocity !== undefined) b.setAngularVelocity(p1.fromArray(o.angularVelocity)); // radian
		if (o.linearFactor !== undefined) b.setLinearFactor(p1.fromArray(o.linearFactor));
		if (o.angularFactor !== undefined) b.setAngularFactor(p1.fromArray(o.angularFactor));
		if (o.ccdT !== undefined) b.setCcdMotionThreshold(o.ccdT); // 1e-7
		if (o.ccdR !== undefined) b.setCcdSweptSphereRadius(o.ccdR); // 0.2 // 0.0 by default

		v.free();
		localInertia.free();
		p1.free();
		p2.free();
		q.free();
		s.free();

		return b;
	}
	step() {}

	sync() {}

	start() {
		this.ison = true;
	}

	stop() {
		this.ison = false;
	}
}
*/
