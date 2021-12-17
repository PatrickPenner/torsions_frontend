/**
 * NGL Geometry marker for a torsion
 */
class TorsionMarker {
  /**
   * NGL Geometry marker for a torsion
   * @param {Object} structure ngl structure the torsion is in
   * @param {Object} torsionResult torsion result of the torsion to visualize
   * @param {Object} stage ngl stage
   */
  constructor (structure, torsionResult, stage) {
    this.structure = structure
    this.torsionResult = torsionResult
    this.stage = stage
    this.color = [0, 1, 0]
    if (torsionResult.quality === 'tolerable') {
      this.color = [1, 1, 0]
    } else if (torsionResult.quality === 'strained') {
      this.color = [1, 0, 0]
    }
    this.bondMarker = this.makeTorsionMarker()
    this.atomMarkers = this.makeAtomMarkers()
  }

  /**
   * Make a cylindrical marker along the torsion bond
   * @returns {Object} shape component
   */
  makeTorsionMarker () {
    const atom2Position = this.structure.getAtomProxy(this.torsionResult.atomId2 - 1).positionToVector3()
    const atom3Position = this.structure.getAtomProxy(this.torsionResult.atomId3 - 1).positionToVector3()
    const direction = atom3Position.clone().sub(atom2Position)
    const startPosition = atom2Position.clone().addScaledVector(direction, 0.1)
    const endPosition = atom2Position.clone().addScaledVector(direction, 0.9)
    const componentName = 'Torsion: ' + this.torsionResult.id
    const torsionGeometry = new NGL.Shape(componentName)
    torsionGeometry.addCylinder(startPosition.toArray(), endPosition.toArray(), this.color, 0.2, componentName)
    const torsionMarkerComponent = this.stage.addComponentFromObject(torsionGeometry)
    torsionMarkerComponent.addRepresentation('buffer', { opacity: 0.5 })
    return torsionMarkerComponent
  }

  /**
   * Make atom markers for the one and four atoms of the torsion angle
   * @returns {Object} atom marker component
   */
  makeAtomMarkers () {
    const atom1Position = this.structure.getAtomProxy(this.torsionResult.atomId1 - 1).positionToVector3()
    const atom4Position = this.structure.getAtomProxy(this.torsionResult.atomId4 - 1).positionToVector3()
    const componentName = 'Torsion Atoms: ' + this.torsionResult.id
    const atomMarkerGeometry = new NGL.Shape(componentName)
    atomMarkerGeometry.addSphere(atom1Position, [1.0, 0, 0.75], 0.4)
    atomMarkerGeometry.addSphere(atom4Position, [1.0, 0, 0.75], 0.4)
    const atomMarkerComponent = this.stage.addComponentFromObject(atomMarkerGeometry)
    atomMarkerComponent.addRepresentation('buffer')
    atomMarkerComponent.reprList[0].setVisibility(false)
    atomMarkerComponent.reprList[0].setParameters({ opacity: 0.8 })
    atomMarkerComponent.setVisibility(false)
    return atomMarkerComponent
  }

  /**
   * Set whether the torsion marker is highlighted
   * @param {Boolean} highlight
   */
  setHighlight (highlight) {
    this.bondMarker.reprList[0].setParameters({ opacity: highlight ? 1.0 : 0.5 })
    this.atomMarkers.reprList[0].setVisibility(highlight)
  }

  /**
   * Set whether the torsion marker is visible
   * @param {Boolean} visible
   */
  setVisibility (visible) {
    this.bondMarker.setVisibility(visible)
    this.atomMarkers.setVisibility(visible)
  }
}
