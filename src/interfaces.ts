export interface JutsusBody { href: string; title: string }

export interface DebutInfo {
    'Appears in' ?: string | null,
    Manga?: string | null
}

export interface DataInfo {
    Classification ?: string | null,
    Nature ?: string | null,
    Class ?: string | null,
    Range ?: string | null,
}

export interface info_jutsus {
    Debut ?: DebutInfo | null,
    Data ?:DataInfo | null
}