describe('TorsionResultTable', function () {
  const testMolecule = {
    'entryId': 681,
    'name': 'DX9',
    'molString': 'DX9\n  -ISIS-            3D\n\n 61 64  0  0  0  0  0  0  0  0  0\n   29.1290   11.4250   15.9630 C   0  0  0  0  0\n   28.8110   10.6450   17.0780 C   0  0  0  0  0\n   28.3350   11.2370   18.2700 C   0  0  0  0  0\n   28.1740   12.6380   18.3360 C   0  0  0  0  0\n   28.4890   13.4200   17.2120 C   0  0  0  0  0\n   28.3420   14.8070   17.2320 C   0  0  0  0  0\n   28.6700   15.5540   16.0850 C   0  0  0  0  0\n   29.1590   14.9250   14.9110 C   0  0  0  0  0\n   29.2930   13.5430   14.8900 C   0  0  0  0  0\n   28.9740   12.8030   16.0210 C   0  0  0  0  0\n   29.5010   15.7310   13.6910 C   0  0  0  0  0\n   28.9960   17.0900   13.6140 N   0  0  0  0  0\n   30.1770   15.1780   12.7650 N   0  0  0  0  0\n   29.0130    9.1480   16.9340 C   0  0  0  0  0\n   28.0140    6.8790   17.4520 C   0  0  0  0  0\n   27.6190    6.2270   18.4150 O   0  0  0  0  0\n   28.6210    6.2620   16.5880 O   0  0  0  0  0\n   27.7540    8.3360   17.3380 C   0  0  0  0  0\n   21.9360    7.1010   11.9800 N   0  0  0  0  0\n   21.9280    6.9890   13.4310 C   0  0  0  0  0\n   21.9820    8.4810   13.8330 C   0  0  0  0  0\n   21.0260    9.0990   12.7970 C   0  0  0  0  0\n   21.5120    8.4190   11.4890 C   0  0  0  0  0\n   22.2830    6.0930   11.2050 C   0  0  0  0  0\n   22.2530    6.1890    9.9300 N   0  0  0  0  0\n   22.7350    4.7550   11.8050 C   0  0  0  0  0\n   25.0330    8.2720   17.0890 C   0  0  0  0  0\n   24.0060    8.4440   16.2600 C   0  0  0  0  0\n   26.6970    8.8470   15.0930 C   0  0  0  0  0\n   25.5950    9.0090   14.2620 C   0  0  0  0  0\n   24.2920    8.8250   14.7840 C   0  0  0  0  0\n   23.3160    9.0370   13.8050 O   0  0  0  0  0\n   26.4880    8.4970   16.4490 C   0  0  0  0  0\n   29.4940   10.9580   15.0600 H   0  0  0  0  0\n   28.0960   10.6220   19.1250 H   0  0  0  0  0\n   27.8130   13.1040   19.2410 H   0  0  0  0  0\n   27.9800   15.3030   18.1200 H   0  0  0  0  0\n   28.5470   16.6270   16.0990 H   0  0  0  0  0\n   29.6440   13.0460   13.9980 H   0  0  0  0  0\n   21.0280    6.4830   13.8100 H   0  0  0  0  0\n   29.3190   17.4670   12.7460 H   0  0  0  0  0\n   30.3730   14.2460   13.0700 H   0  0  0  0  0\n   30.4570   15.5940   11.9000 H   0  0  0  0  0\n   29.2470    8.9280   15.8820 H   0  0  0  0  0\n   29.8320    8.8540   17.6070 H   0  0  0  0  0\n   28.6780    5.3460   16.8330 H   0  0  0  0  0\n   27.5310    8.7940   18.3130 H   0  0  0  0  0\n   22.7450    6.3780   13.8430 H   0  0  0  0  0\n   19.9720    8.8750   13.0170 H   0  0  0  0  0\n   22.3380    8.9710   11.0160 H   0  0  0  0  0\n   20.7460    8.3740   10.7010 H   0  0  0  0  0\n   22.5440    5.3420    9.4850 H   0  0  0  0  0\n   21.0520   10.1980   12.7650 H   0  0  0  0  0\n   22.8430    4.0110   11.0020 H   0  0  0  0  0\n   23.7010    4.8890   12.3130 H   0  0  0  0  0\n   21.9840    4.4060   12.5300 H   0  0  0  0  0\n   24.8960    7.9990   18.1250 H   0  0  0  0  0\n   22.9910    8.3200   16.6090 H   0  0  0  0  0\n   27.6970    8.9860   14.7100 H   0  0  0  0  0\n   25.7320    9.2740   13.2240 H   0  0  0  0  0\n   21.6900    8.6770   14.8750 H   0  0  0  0  0\n  1  2  2  0  0  0\n  1 10  1  0  0  0\n  1 34  1  0  0  0\n  2  3  1  0  0  0\n  2 14  1  0  0  0\n  3  4  2  0  0  0\n  3 35  1  0  0  0\n  4  5  1  0  0  0\n  4 36  1  0  0  0\n  5  6  2  0  0  0\n  5 10  1  0  0  0\n  6  7  1  0  0  0\n  6 37  1  0  0  0\n  7  8  2  0  0  0\n  7 38  1  0  0  0\n  8  9  1  0  0  0\n  8 11  1  0  0  0\n  9 10  2  0  0  0\n  9 39  1  0  0  0\n 11 12  2  0  0  0\n 11 13  1  0  0  0\n 12 41  1  0  0  0\n 13 42  1  0  0  0\n 13 43  1  0  0  0\n 14 18  1  0  0  0\n 14 44  1  0  0  0\n 14 45  1  0  0  0\n 15 16  2  0  0  0\n 15 17  1  0  0  0\n 15 18  1  0  0  0\n 17 46  1  0  0  0\n 18 33  1  0  0  0\n 18 47  1  0  0  0\n 19 20  1  0  0  0\n 19 23  1  0  0  0\n 19 24  1  0  0  0\n 20 40  1  0  0  0\n 20 21  1  0  0  0\n 20 48  1  0  0  0\n 21 22  1  0  0  0\n 21 32  1  0  0  0\n 21 61  1  0  0  0\n 22 23  1  0  0  0\n 22 49  1  0  0  0\n 22 53  1  0  0  0\n 23 50  1  0  0  0\n 23 51  1  0  0  0\n 24 25  2  0  0  0\n 24 26  1  0  0  0\n 25 52  1  0  0  0\n 26 54  1  0  0  0\n 26 55  1  0  0  0\n 26 56  1  0  0  0\n 27 28  2  0  0  0\n 27 33  1  0  0  0\n 27 57  1  0  0  0\n 28 31  1  0  0  0\n 28 58  1  0  0  0\n 29 30  1  0  0  0\n 29 33  2  0  0  0\n 29 59  1  0  0  0\n 30 31  2  0  0  0\n 30 60  1  0  0  0\n 31 32  1  0  0  0\nM  END\n$$$$\n',
    'fileType': '.sdf',
    'torsionResults': [{
      'id': 1191,
      'atomId1': 61,
      'atomId2': 21,
      'atomId3': 32,
      'atomId4': 31,
      'angle': 45.6403,
      'quality': 'relaxed',
      'patternHierarchy': '[H:1][CX4H1:2]!@[OX2:3][!#1:4]|[CX4:2][OX2:3]|CO',
      'torsionPattern': {
        'id': 135,
        'smarts': '[H:1][CX4H1:2]!@[OX2:3][!#1:4]',
        'plotPath': 'static/torsion_lib/135.svg'
      }
    }, {
      'id': 1192,
      'atomId1': 27,
      'atomId2': 33,
      'atomId3': 18,
      'atomId4': 47,
      'angle': -40.9088,
      'quality': 'relaxed',
      'patternHierarchy': '[a:1][c:2]!@[CX4H1:3][H:4]|[c:2][CX4H2,CX4H1,CX4H0:3]|[c:2][C:3]|CC',
      'torsionPattern': {
        'id': 429,
        'smarts': '[a:1][c:2]!@[CX4H1:3][H:4]',
        'plotPath': 'static/torsion_lib/429.svg'
      }
    }, {
      'id': 1193,
      'atomId1': 1,
      'atomId2': 2,
      'atomId3': 14,
      'atomId4': 18,
      'angle': -128.412,
      'quality': 'tolerable',
      'patternHierarchy': '[cH1:1][c:2]([cH1])!@[CX4H2:3][$([CX4H1]C(=O)O):4]|[c:2][CX4H2,CX4H1,CX4H0:3]|[c:2][C:3]|CC',
      'torsionPattern': {
        'id': 407,
        'smarts': '[cH1:1][c:2]([cH1])!@[CX4H2:3][$([CX4H1]C(=O)O):4]',
        'plotPath': 'static/torsion_lib/407.svg'
      }
    }, {
      'id': 1194,
      'atomId1': 33,
      'atomId2': 18,
      'atomId3': 15,
      'atomId4': 16,
      'angle': -96.3475,
      'quality': 'relaxed',
      'patternHierarchy': '[c:1][CX4:2]!@[CX3:3]=[O:4]|[CX4:2][CX3:3]|[C:2][C:3]|CC',
      'torsionPattern': {
        'id': 360,
        'smarts': '[c:1][CX4:2]!@[CX3:3]=[O:4]',
        'plotPath': 'static/torsion_lib/360.svg'
      }
    }, {
      'id': 1195,
      'atomId1': 33,
      'atomId2': 18,
      'atomId3': 14,
      'atomId4': 2,
      'angle': 66.1771,
      'quality': 'relaxed',
      'patternHierarchy': '[!#1:1][CX4:2]!@[CX4:3][!#1:4]|[CX4:2][CX4:3]|[C:2][C:3]|CC',
      'torsionPattern': {
        'id': 351,
        'smarts': '[!#1:1][CX4:2]!@[CX4:3][!#1:4]',
        'plotPath': 'static/torsion_lib/351.svg'
      }
    }]
  }

  beforeEach(function () {
    document.body.appendChild(ElementBuilder.generate('div')
      .setAttribute('id', 'torsion-result-table').element)
    document.body.appendChild(ElementBuilder.generate('div')
      .setAttribute('id', 'viewport').element)
  })

  afterEach(function () {
    document.getElementById('torsion-result-table').remove()
    document.getElementById('viewport').remove()
  })

  it('creates the torsion result table', async function () {
    const stage = new NGL.Stage('viewport')
    const molecule = testMolecule
    await Utils.addStructure(stage, molecule).then((component) => molecule.component = component)
    const torsionResultsTable = new TorsionResultsTable('torsion-result-table', stage, molecule)
    const rows = document.querySelectorAll('tr.odd, tr.even')
    expect(rows[0]).toHaveClass('highlight')
    expect(rows.length).toEqual(testMolecule.torsionResults.length)
    const cells = rows[0].getElementsByTagName('td')
    expect(cells.length).toEqual(4)
    expect(cells[0].innerText).toEqual(testMolecule.torsionResults[0].id.toString())
    expect(cells[1].innerText).toEqual(testMolecule.torsionResults[0].angle.toString())
    expect(cells[2].innerText).toEqual(Utils.capitalize(testMolecule.torsionResults[0].quality))
  })

  it('sets the molecule', async function () {
    const stage = new NGL.Stage('viewport')
    const molecule = testMolecule
    await Utils.addStructure(stage, molecule).then((component) => molecule.component = component)
    const torsionResultsTable = new TorsionResultsTable('torsion-result-table', stage)
    torsionResultsTable.setMolecule(molecule)
    const rows = document.querySelectorAll('tr.odd, tr.even')
    expect(rows[0]).toHaveClass('highlight')
    expect(rows.length).toEqual(testMolecule.torsionResults.length)
    const cells = rows[0].getElementsByTagName('td')
    expect(cells.length).toEqual(4)
    expect(cells[0].innerText).toEqual(testMolecule.torsionResults[0].id.toString())
    expect(cells[1].innerText).toEqual(testMolecule.torsionResults[0].angle.toString())
    expect(cells[2].innerText).toEqual(Utils.capitalize(testMolecule.torsionResults[0].quality))
  })

  it('highlights clicked rows', async function () {
    const stage = new NGL.Stage('viewport')
    const molecule = testMolecule
    await Utils.addStructure(stage, molecule).then((component) => molecule.component = component)
    const torsionResultsTable = new TorsionResultsTable('torsion-result-table', stage, molecule)
    const rows = document.querySelectorAll('tr.odd, tr.even')
    expect(rows[0]).toHaveClass('highlight')

    const idCell = rows[1].getElementsByTagName('td')[0]
    const event = { target: idCell }
    torsionResultsTable.handleTableClicked(event)
    expect(rows[1]).toHaveClass('highlight')
    expect(rows[0]).not.toHaveClass('highlight')
  })
})
