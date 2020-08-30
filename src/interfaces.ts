export interface JutsusBody { href: string; title: string }

export interface DebutInfo {
    appears_in ?: string | null,
    manga?: string | null
}

export interface DataInfo {
    classification ?: string | null,
    nature ?: string | null,
    class ?: string | null,
    range ?: string | null,
}

export interface info_jutsus {
    name ?: string | null,
    url ?: string | null,
    debut ?: DebutInfo | null,
    data ?:DataInfo | null
}