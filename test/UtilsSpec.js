describe('Utils', function () {
  it('compares torsion quality', function () {
    expect(Utils.compareTorsionQuality('Relaxed', 'Tolerable')).toEqual(1)
    expect(Utils.compareTorsionQuality('Tolerable', 'Relaxed')).toEqual(-1)
    expect(Utils.compareTorsionQuality('Relaxed', 'Relaxed')).toEqual(0)
    expect(Utils.compareTorsionQuality('Relaxed', 'Strained')).toEqual(1)
    expect(Utils.compareTorsionQuality('Strained', 'Relaxed')).toEqual(-1)
    expect(Utils.compareTorsionQuality('Tolerable', 'Strained')).toEqual(1)
    expect(Utils.compareTorsionQuality('Strained', 'Tolerable')).toEqual(-1)
  })
})
